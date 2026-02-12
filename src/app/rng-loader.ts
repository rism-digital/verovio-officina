/**
 * The RNGLoader class for parsing and storing an RNG Schema.
 */
export class RNGLoader {
    private tags: Record<string, unknown>;

    private readonly rngNs: string;

    constructor() {
        this.rngNs = "http://relaxng.org/ns/structure/1.0";
        this.tags = {}
    }

    ////////////////////////////////////////////////////////////////////////
    // Class-specific method
    ////////////////////////////////////////////////////////////////////////

    setRelaxNGSchema(data: string): void {
        const parser = new window.DOMParser();
        const doc = parser.parseFromString(data, "text/xml");

        "use strict";
        this.tags = {}
        const funcThis = this;
        let definitions = this.collectDefinitions(doc);
        let elements: ElementsMap = {};
        Object.keys(definitions).map(function (key) {
            definitions[key].map(function (define: Element) {
                funcThis.findElements(definitions, define, elements);
            });
        });
        elements["!top"] = this.findAllTopLevelElements(definitions, [], doc);
        this.tags = this.sortObject(elements);
    }

    //////////////////////////////////////////////////////////////////////////////
    // Getters and setters
    //////////////////////////////////////////////////////////////////////////////

    public getTags(): Record<string, unknown> { return this.tags; }

    //////////////////////////////////////////////////////////////////////////////
    // schemaInfoCreator
    //////////////////////////////////////////////////////////////////////////////

    /**
     * Collect all <define/> elements.
     */
    private collectDefinitions(doc: Document): Record<string, Element[]> {
        "use strict";
        let /**@type{!Object<!string,!Array.<!Element>>}*/
            definitions: Record<string, Element[]> = {},
            defs = doc.getElementsByTagNameNS(this.rngNs, "define");
        for (let i = 0; i < defs.length; i += 1) {
            const def = defs.item(i);
            if (!def) continue;
            const name = def.getAttribute("name");
            if (!name) continue;
            const array = definitions[name] = definitions[name] || [];
            array.push(def);
        }
        return definitions;
    }

    /**
     * Continue recursion in the definition elements for the given reference.
     */
    private followReference(
        defs: Record<string, Element[]>,
        stack: Array<string>,
        ref: Element,
        handler: (e: Element) => void
    ): void {
        "use strict";
        const nameAttr = ref.getAttribute("name");
        if (!nameAttr) return;
        let name = nameAttr.trim();
        if (stack.indexOf(name) === -1) { // avoid infinite loop
            stack.push(name);
            const list = defs[name];
            if (list) list.map(handler);
            stack.pop();
        }
    }

    /**
     * Recurse into the child elements. Follow references.
     */
    private recurseRng(
        defs: Record<string, Element[]>,
        stack: Array<string>,
        rng: Element,
        handler: (e: Element) => void
    ): void {
        "use strict";
        if (this.isRng(rng, "ref")) {
            this.followReference(defs, stack, rng, function (e) {
                handler(e);
            });
        } else {
            let child = rng.firstElementChild;
            while (child) {
                handler(child);
                child = child.nextElementSibling;
            }
        }
    }

    /**
     * Collect the text from all the <value/> elements.
     */
    private getAttributeValues(
        defs: Record<string, Element[]>,
        stack: Array<string>,
        rng: Element,
        values: Array<string>,
        types: Array<string>
    ): void {
        "use strict";
        if (this.isRng(rng, "value")) {
            const text = rng.textContent ? rng.textContent.trim() : "";
            if (!text) return;
            if (values.indexOf(text) === -1) {
                values.push(text);
            }
        }
        else if (this.isRng(rng, "data")) {
            const type = rng.getAttribute("type");
            if (type) types.push(type);
        } else {
            const funcThis = this;
            this.recurseRng(defs, stack, rng, function (e) {
                funcThis.getAttributeValues(defs, stack, e, values, types);
            });
        }
    }

    /**
     * Get the possible names for an element or attribute.
     */
    private getNamesRecurse(e: Element, names: Array<string>): void {
        "use strict";
        let child;
        if (this.isRng(e, "name")) {
            names.push(e.textContent);
        } else if (this.isRng(e, "choice")) {
            child = e.firstElementChild;
            while (child) {
                this.getNamesRecurse(child, names);
                child = child.nextElementSibling;
            }
        }
    }

    /**
     * Get the possible names for an element or attribute.
     */
    private getNames(e: Element): Array<string> {
        "use strict";
        if (e.hasAttribute("name")) {
            return [e.getAttribute("name") as string];
        }
        let names: Array<string> = [],
            child = e.firstElementChild;
        while (child) {
            this.getNamesRecurse(child, names);
            child = child.nextElementSibling;
        }
        return names;
    }

    /**
     * Find the allowed child elements and attributes for an element.
     */
    private defineElement(
        defs: Record<string, Element[]>,
        stack: Array<string>,
        rng: Element,
        def: ElementDef
    ): void {
        "use strict";
        let names: Array<string> = new Array<string>;
        let values: Array<string> = new Array<string>;
        let types: Array<string> = new Array<string>;
        if (this.isRng(rng, "element")) {
            names = this.getNames(rng);
            names.map(function (name) {
                if (def.children.indexOf(name) === -1) {
                    def.children.push(name);
                }
            });
        } else if (this.isRng(rng, "attribute")) {
            this.getAttributeValues(defs, stack, rng, values, types);
            names = this.getNames(rng);
            if (values.length === 0) {
                values = [];
            }
            names.map(function (name) {
                if (def.attrs[name]) {
                    def.attrs[name] = def.attrs[name].concat(values);
                } else {
                    def.attrs[name] = values;
                }
                if (types && types.length > 0) {
                    def.types[name] = types[0];
                }
            });
        } else if (this.isRng(rng, "text")) {
            def.text = true;
        } else {
            const funcThis = this;
            this.recurseRng(defs, stack, rng, function (e: Element) {
                funcThis.defineElement(defs, stack, e, def);
            });
        }
    }

    private sortObject<T>(unordered: Record<string, T>): Record<string, T> {
        "use strict";
        let ordered: Record<string, T> = {},
            keys = Object.keys(unordered);
        keys.sort();
        keys.map(function copy(key) {
            ordered[key] = unordered[key];
        });
        return ordered;
    }

    private sortAttributeValues(attrs: Record<string, Array<string>>): void {
        "use strict";
        let keys = Object.keys(attrs);
        keys.map(function (key) {
            let a = attrs[key];
            if (a) {
                a.sort();
            }
        });
    }

    private findElements(defs: Record<string, Element[]>, rng: Element, elements: ElementsMap): void {
        "use strict";
        let child,
            names,
            element: ElementDef;
        if (this.isRng(rng, "element")) {
            element = { attrs: {}, children: [], types: {} };
            child = rng.firstElementChild;
            while (child) {
                this.defineElement(defs, [], child, element);
                child = child.nextElementSibling;
            }
            element.children.sort();
            element.attrs = this.sortObject(element.attrs);
            this.sortAttributeValues(element.attrs);
            names = this.getNames(rng);
            names.map(function (name) {
                elements[name] = element;
            });
        } else {
            child = rng.firstElementChild;
            while (child) {
                this.findElements(defs, child, elements);
                child = child.nextElementSibling;
            }
        }
    }


    private findTopLevelElements(defs: Record<string, Element[]>, stack: Array<any>, rng: Element, top: Array<any>): void {
        "use strict";
        if (rng.localName === "element") {
            if (rng.hasAttribute("name")) {
                top.push(rng.getAttribute("name"));
            }
        } else {
            const funcThis = this;
            this.recurseRng(defs, stack, rng, function (e) {
                funcThis.findTopLevelElements(defs, stack, e, top);
            });
        }
    }


    private findAllTopLevelElements(defs: Record<string, Element[]>, stack: Array<any>, doc: Document): Array<string> {
        "use strict";
        let top: Array<string> = [];
        let starts = doc.getElementsByTagNameNS(this.rngNs, "start");
        for (let i = 0; i < starts.length; i += 1) {
            const e = starts.item(i);
            if (!e) continue;
            this.findTopLevelElements(defs, stack, e, top);
        }
        return top;
    }

    private isRng(e: Element, name: string): boolean {
        "use strict";
        return e.namespaceURI === this.rngNs && e.localName === name;
    }
}

type ElementDef = {
    attrs: Record<string, Array<string>>;
    children: Array<string>;
    types: Record<string, string>;
    text?: boolean;
};

type ElementsMap = Record<string, ElementDef | Array<string>>;
