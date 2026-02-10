export type VerovioOptions = {
  adjustPageHeight: boolean;
  adjustPageWidth: boolean;
  appXPathQuery?: Array<string>;
  breaks: string;
  choiceXPathQuery?: Array<string>;
  footer: string;
  justifyVertically: boolean;
  mensuralResponsiveView: string;
  pageHeight: number;
  pageWidth: number;
  pageMarginLeft: number;
  pageMarginRight: number;
  pageMarginTop: number;
  pageMarginBottom: number;
  scale: number;
  xmlIdSeed: number;
};

export type VerovioToolkit = {
  edit: (mei: string) => string;
  editInfo: () => string;
  getAvailableOptions: () => string;
  getDefaultOptions: () => string;
  getElementAttr: (id: string) => string;
  getElementsAtTime: (time: number) => string;
  getLog: () => string;
  getOptions: () => string;
  getMEI: () => string;
  getPageCount: () => number;
  getPageWithElement: (id: string) => number;
  loadData: (mei: string) => void;
  redoLayout: () => void;
  redoPagePitchPosLayout: () => void;
  renderToExpansionMap: () => string;
  renderToMIDI: () => string;
  renderToSVG: (page: number) => string;
  select: (id: string) => string;
  setOptions: (options: VerovioOptions) => void;
  getVersion: () => string;
  onRuntimeInitialized: () => void;
};

export interface Options {
  adjustPageHeight: boolean;
  adjustPageWidth: boolean;
  appXPathQuery?: Array<string>;
  breaks: string;
  choiceXPathQuery?: Array<string>;
  footer: string;
  justifyVertically: boolean;
  mensuralResponsiveView: string;
  pageHeight: number;
  pageWidth: number;
  pageMarginLeft: number;
  pageMarginRight: number;
  pageMarginTop: number;
  pageMarginBottom: number;
  scale: number;
  xmlIdSeed: number;
}
