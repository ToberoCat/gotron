import { DOMParser } from "xmldom";
import { select, SelectedValue } from "xpath";
import { Device } from "../Device";
import { DeviceActor } from "./Controller";
import { ExecResult, Vector2 } from "../index";
import { App } from "./AppController";

export class Hierarchy extends DeviceActor {
  private static readonly parser = new DOMParser();
  private readonly _document: Document;
  private readonly _xml: string;

  constructor(device: Device, xmlHierarchy: string) {
    super(device);
    this._xml = xmlHierarchy;
    this._document = Hierarchy.parser
      .parseFromString(xmlHierarchy, "text/xml");
  }

  public findElementsById(index: string): Array<AppElement> {
    return this.selectXPath(`//node[@index="${index}"]`)
      .map(x => new AppElement(this.device, x));
  }

  public findElementsByClass(className: string): Array<AppElement> {
    return this.selectXPath(`//node[@class="${className}"]`)
      .map(x => new AppElement(this.device, x));
  }

  public findElementsByText(text: string): Array<AppElement> {
    return this.selectXPath(`//node[@text="${text}"]`)
      .map(x => new AppElement(this.device, x));
  }

  public findElementsByXPath(expression: string): Array<AppElement> {
    return this.selectXPath(expression)
      .map(x => new AppElement(this.device, x));
  }

  private selectXPath(expression: string): Array<SelectedValue> {
    return select(expression, this._document);
  }

  get document(): Document {
    return this._document;
  }


  get xml(): string {
    return this._xml;
  }
}

export class AppElement extends DeviceActor {
  private readonly _rawElement: SelectedValue;
  private readonly _index: string;
  private readonly _text: string;
  private readonly _resourceId: string;
  private readonly _className: string;
  private readonly _packageName: string;
  private readonly _contentDesc: string;
  private readonly _checkable: boolean;
  private readonly _checked: boolean;
  private readonly _clickable: boolean;
  private readonly _enabled: boolean;
  private readonly _focusable: boolean;
  private readonly _focused: boolean;
  private readonly _scrollable: boolean;
  private readonly _longClickable: boolean;
  private readonly _password: boolean;
  private readonly _selected: boolean;
  private readonly _bounds: Bounds;

  // @ts-ignore
  constructor(device: Device, rawElement) {
    super(device);
    this._rawElement = rawElement;
    this._index = rawElement.attributes["0"].value;
    this._text = rawElement.attributes["1"].value;
    this._resourceId = rawElement.attributes["2"].value;
    this._className = rawElement.attributes["3"].value;
    this._packageName = rawElement.attributes["4"].value;
    this._contentDesc = rawElement.attributes["5"].value;
    this._checkable = rawElement.attributes["6"].value;
    this._checked = rawElement.attributes["7"].value;
    this._clickable = rawElement.attributes["8"].value;
    this._enabled = rawElement.attributes["9"].value;
    this._focusable = rawElement.attributes["10"].value;
    this._focused = rawElement.attributes["11"].value;
    this._scrollable = rawElement.attributes["12"].value;
    this._longClickable = rawElement.attributes["13"].value;
    this._password = rawElement.attributes["14"].value;
    this._selected = rawElement.attributes["15"].value;

    const bounds = rawElement.attributes["16"].value.split(/[\[\],]/gm).filter((x: any) => x).map(parseFloat);
    this._bounds = new Bounds(bounds[0], bounds[1], bounds[2], bounds[3]);
  }

  public click(): Promise<ExecResult> {
    //ToDo: Implement automatic scrolling to make the element visible
    const center = this._bounds.center();
    return this.device.inputs.click(center.x, center.y);
  }

  get rawElement(): SelectedValue {
    return this._rawElement;
  }


  get index(): string {
    return this._index;
  }

  get text(): string {
    return this._text;
  }

  get resourceId(): string {
    return this._resourceId;
  }

  get className(): string {
    return this._className;
  }

  get packageName(): string {
    return this._packageName;
  }

  get contentDesc(): string {
    return this._contentDesc;
  }

  get checkable(): boolean {
    return this._checkable;
  }

  get checked(): boolean {
    return this._checked;
  }

  get clickable(): boolean {
    return this._clickable;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get focusable(): boolean {
    return this._focusable;
  }

  get focused(): boolean {
    return this._focused;
  }

  get scrollable(): boolean {
    return this._scrollable;
  }

  get longClickable(): boolean {
    return this._longClickable;
  }

  get password(): boolean {
    return this._password;
  }

  get selected(): boolean {
    return this._selected;
  }

  get bounds(): Bounds {
    return this._bounds;
  }
}

class Bounds {
  private readonly _min: Vector2;
  private readonly _max: Vector2;

  constructor(minX: number, minY: number, maxX: number, maxY: number) {
    this._min = new Vector2(minX, minY);
    this._max = new Vector2(maxX, maxY);
  }

  public center(): Vector2 {
    return this._max
      .sub(this._min)
      .div(2)
      .add(this._min);
  }


  get min(): Vector2 {
    return this._min;
  }

  get max(): Vector2 {
    return this._max;
  }
}