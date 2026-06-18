<script lang="ts">
    import { onMount, tick } from "svelte";

    const letters = [
        "A",
        "W",
        "S",
        "E",
        "D",
        "F",
        "T",
        "G",
        "Y",
        "H",
        "U",
        "J",
        "K",
        "O",
        "L",
        "P",
        ";",
    ];

    let keyboardWrapper: HTMLDivElement | null = null;
    let keys: HTMLDivElement | null = null;
    let octaves: HTMLDivElement | null = null;
    let currentOctave = 4;
    let isActivated = false;

    function maxSelectableOctave() {
        if (!keys || !octaves) return currentOctave;
        const maxByKeys = Math.floor((keys.children.length - 1) / 12) + 1;
        return Math.min(octaves.children.length, maxByKeys);
    }

    function activateLower() {
        if (currentOctave <= 1) return;
        currentOctave--;
        activate();
    }

    function activateHigher() {
        if (currentOctave >= maxSelectableOctave()) return;
        currentOctave++;
        activate();
    }

    function scrollOctaveToCenter(octave: HTMLElement, smooth: boolean) {
        if (!keyboardWrapper) return;
        const wrapperRect = keyboardWrapper.getBoundingClientRect();
        const octaveRect = octave.getBoundingClientRect();
        const shift =
            keyboardWrapper.scrollLeft +
            octaveRect.left +
            octaveRect.width / 2 -
            wrapperRect.left -
            wrapperRect.width / 2;

        keyboardWrapper.scroll({
            left: shift,
            behavior: smooth ? "smooth" : "auto",
        });
    }

    async function activate() {
        await tick();
        if (!keyboardWrapper || !keys || !octaves) return;

        keys.querySelectorAll(".vrv-keyboard-key").forEach((element) => {
            element.classList.remove("selected");
            element.removeAttribute("data-key");
        });
        octaves.querySelectorAll(".vrv-keyboard-octave").forEach((element) => {
            element.classList.remove("selected");
        });

        let key = keys.children[(currentOctave - 1) * 12] as HTMLElement | null;
        for (const letter of letters) {
            if (!key) break;
            key.setAttribute("data-key", letter);
            key.classList.add("selected");
            key = key.nextElementSibling as HTMLElement | null;
        }

        const octave = octaves.children[currentOctave - 1] as
            | HTMLElement
            | undefined;
        if (!octave) return;
        octave.classList.add("selected");
        scrollOctaveToCenter(octave, isActivated);
        isActivated = true;
    }

    function handleNavigatorKeydown(
        event: KeyboardEvent,
        direction: "lower" | "higher",
    ) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (direction === "lower") activateLower();
        else activateHigher();
    }

    onMount(() => {
        activate();
    });
</script>

<div class="vrv-keyboard-panel">
    <div
        class="vrv-keyboard-navigator vrv-keyboard-navigator-left vrv-clickable"
        role="button"
        tabindex="0"
        aria-label="Move keyboard selection down one octave"
        on:click={activateLower}
        on:keydown={(event) => handleNavigatorKeydown(event, "lower")}
    ></div>
    <div class="vrv-keyboard-wrapper" bind:this={keyboardWrapper}>
        <div class="vrv-keyboard-octaves" bind:this={octaves}>
            <div class="vrv-keyboard-octave">C0</div>
            <div class="vrv-keyboard-octave">C1</div>
            <div class="vrv-keyboard-octave selected">C2</div>
            <div class="vrv-keyboard-octave">C3</div>
            <div class="vrv-keyboard-octave">C4</div>
            <div class="vrv-keyboard-octave">C5</div>
            <div class="vrv-keyboard-octave">C6</div>
            <div class="vrv-keyboard-octave">C7</div>
            <div class="vrv-keyboard-octave">C8</div>
        </div>
        <div
            class="vrv-keyboard-keys"
            data-app-el-id="27e293eda8b10000"
            bind:this={keys}
        >
            <div class="vrv-keyboard-key white" data-midi="12"></div>
            <div class="vrv-keyboard-key black" data-midi="13"></div>
            <div class="vrv-keyboard-key white" data-midi="14"></div>
            <div class="vrv-keyboard-key black" data-midi="15"></div>
            <div class="vrv-keyboard-key white" data-midi="16"></div>
            <div class="vrv-keyboard-key white" data-midi="17"></div>
            <div class="vrv-keyboard-key black" data-midi="18"></div>
            <div class="vrv-keyboard-key white" data-midi="19"></div>
            <div class="vrv-keyboard-key black" data-midi="20"></div>
            <div class="vrv-keyboard-key white" data-midi="21"></div>
            <div class="vrv-keyboard-key black" data-midi="22"></div>
            <div class="vrv-keyboard-key white" data-midi="23"></div>
            <div class="vrv-keyboard-key white" data-midi="24"></div>
            <div class="vrv-keyboard-key black" data-midi="25"></div>
            <div class="vrv-keyboard-key white" data-midi="26"></div>
            <div class="vrv-keyboard-key black" data-midi="27"></div>
            <div class="vrv-keyboard-key white" data-midi="28"></div>
            <div class="vrv-keyboard-key white" data-midi="29"></div>
            <div class="vrv-keyboard-key black" data-midi="30"></div>
            <div class="vrv-keyboard-key white" data-midi="31"></div>
            <div class="vrv-keyboard-key black" data-midi="32"></div>
            <div class="vrv-keyboard-key white" data-midi="33"></div>
            <div class="vrv-keyboard-key black" data-midi="34"></div>
            <div class="vrv-keyboard-key white" data-midi="35"></div>
            <div class="vrv-keyboard-key white" data-midi="36"></div>
            <div class="vrv-keyboard-key black" data-midi="37"></div>
            <div class="vrv-keyboard-key white" data-midi="38"></div>
            <div class="vrv-keyboard-key black" data-midi="39"></div>
            <div class="vrv-keyboard-key white" data-midi="40"></div>
            <div class="vrv-keyboard-key white" data-midi="41"></div>
            <div class="vrv-keyboard-key black" data-midi="42"></div>
            <div class="vrv-keyboard-key white" data-midi="43"></div>
            <div class="vrv-keyboard-key black" data-midi="44"></div>
            <div class="vrv-keyboard-key white" data-midi="45"></div>
            <div class="vrv-keyboard-key black" data-midi="46"></div>
            <div class="vrv-keyboard-key white" data-midi="47"></div>
            <div class="vrv-keyboard-key white" data-midi="48"></div>
            <div class="vrv-keyboard-key black" data-midi="49"></div>
            <div class="vrv-keyboard-key white" data-midi="50"></div>
            <div class="vrv-keyboard-key black" data-midi="51"></div>
            <div class="vrv-keyboard-key white" data-midi="52"></div>
            <div class="vrv-keyboard-key white" data-midi="53"></div>
            <div class="vrv-keyboard-key black" data-midi="54"></div>
            <div class="vrv-keyboard-key white" data-midi="55"></div>
            <div class="vrv-keyboard-key black" data-midi="56"></div>
            <div class="vrv-keyboard-key white" data-midi="57"></div>
            <div class="vrv-keyboard-key black" data-midi="58"></div>
            <div class="vrv-keyboard-key white" data-midi="59"></div>
            <div class="vrv-keyboard-key white" data-midi="60"></div>
            <div class="vrv-keyboard-key black" data-midi="61"></div>
            <div class="vrv-keyboard-key white" data-midi="62"></div>
            <div class="vrv-keyboard-key black" data-midi="63"></div>
            <div class="vrv-keyboard-key white" data-midi="64"></div>
            <div class="vrv-keyboard-key white" data-midi="65"></div>
            <div class="vrv-keyboard-key black" data-midi="66"></div>
            <div class="vrv-keyboard-key white" data-midi="67"></div>
            <div class="vrv-keyboard-key black" data-midi="68"></div>
            <div class="vrv-keyboard-key white" data-midi="69"></div>
            <div class="vrv-keyboard-key black" data-midi="70"></div>
            <div class="vrv-keyboard-key white" data-midi="71"></div>
            <div class="vrv-keyboard-key white" data-midi="72"></div>
            <div class="vrv-keyboard-key black" data-midi="73"></div>
            <div class="vrv-keyboard-key white" data-midi="74"></div>
            <div class="vrv-keyboard-key black" data-midi="75"></div>
            <div class="vrv-keyboard-key white" data-midi="76"></div>
            <div class="vrv-keyboard-key white" data-midi="77"></div>
            <div class="vrv-keyboard-key black" data-midi="78"></div>
            <div class="vrv-keyboard-key white" data-midi="79"></div>
            <div class="vrv-keyboard-key black" data-midi="80"></div>
            <div class="vrv-keyboard-key white" data-midi="81"></div>
            <div class="vrv-keyboard-key black" data-midi="82"></div>
            <div class="vrv-keyboard-key white" data-midi="83"></div>
            <div class="vrv-keyboard-key white" data-midi="84"></div>
            <div class="vrv-keyboard-key black" data-midi="85"></div>
            <div class="vrv-keyboard-key white" data-midi="86"></div>
            <div class="vrv-keyboard-key black" data-midi="87"></div>
            <div class="vrv-keyboard-key white" data-midi="88"></div>
            <div class="vrv-keyboard-key white" data-midi="89"></div>
            <div class="vrv-keyboard-key black" data-midi="90"></div>
            <div class="vrv-keyboard-key white" data-midi="91"></div>
            <div class="vrv-keyboard-key black" data-midi="92"></div>
            <div class="vrv-keyboard-key white" data-midi="93"></div>
            <div class="vrv-keyboard-key black" data-midi="94"></div>
            <div class="vrv-keyboard-key white" data-midi="95"></div>
            <div class="vrv-keyboard-key white" data-midi="96"></div>
            <div class="vrv-keyboard-key black" data-midi="97"></div>
            <div class="vrv-keyboard-key white" data-midi="98"></div>
            <div class="vrv-keyboard-key black" data-midi="99"></div>
            <div class="vrv-keyboard-key white" data-midi="100"></div>
            <div class="vrv-keyboard-key white" data-midi="101"></div>
            <div class="vrv-keyboard-key black" data-midi="102"></div>
            <div class="vrv-keyboard-key white" data-midi="103"></div>
            <div class="vrv-keyboard-key black" data-midi="104"></div>
            <div class="vrv-keyboard-key white" data-midi="105"></div>
            <div class="vrv-keyboard-key black" data-midi="106"></div>
            <div class="vrv-keyboard-key white" data-midi="107"></div>
            <div class="vrv-keyboard-key white" data-midi="108"></div>
            <div class="vrv-keyboard-key black" data-midi="109"></div>
            <div class="vrv-keyboard-key white" data-midi="110"></div>
            <div class="vrv-keyboard-key black" data-midi="111"></div>
            <div class="vrv-keyboard-key white" data-midi="112"></div>
            <div class="vrv-keyboard-key white" data-midi="113"></div>
            <div class="vrv-keyboard-key black" data-midi="114"></div>
            <div class="vrv-keyboard-key white" data-midi="115"></div>
            <div class="vrv-keyboard-key black" data-midi="116"></div>
            <div class="vrv-keyboard-key white" data-midi="117"></div>
            <div class="vrv-keyboard-key black" data-midi="118"></div>
            <div class="vrv-keyboard-key white" data-midi="119"></div>
        </div>
    </div>
    <div
        class="vrv-keyboard-navigator vrv-keyboard-navigator-right vrv-clickable"
        role="button"
        tabindex="0"
        aria-label="Move keyboard selection up one octave"
        on:click={activateHigher}
        on:keydown={(event) => handleNavigatorKeydown(event, "higher")}
    ></div>
</div>
