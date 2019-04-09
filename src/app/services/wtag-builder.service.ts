import { Injectable } from '@angular/core';
import { cloneDeep, debounce, find, first, isEqual, last, range } from 'lodash';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { aW, IW, W } from '../modelsJson/W';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class WTagService {
  public cloneRange: Range;
  public popupTimeout: NodeJS.Timer;
  public rangeInterval: any;
  public showPopup: boolean = false;
  public wTagPopupleft: string = '0px';

  public wTagPopupTop: string = '0px';
  private wTags: Array<{ id: string; w: IW }> = [];
  constructor(private dataService: DataService) {}
  public convertRange(
    node: Node,
    offSet: number,
  ): { lastID: string; offSet: number; startID: string } {
    return {
      startID: first(node.parentElement.getAttribute('w-ids').split(',')),
      lastID: last(node.parentElement.getAttribute('w-ids').split(',')),
      offSet,
    };
  }

  public init() {
    clearInterval(this.rangeInterval);
    this.rangeInterval = setInterval(() => {
      if (
        window.getSelection().rangeCount > 0 &&
        window
          .getSelection()
          .toString()
          .trim() !== ''
      ) {
        this.cloneRange = window
          .getSelection()
          .getRangeAt(0)
          .cloneRange();

        this.wTagPopupTop = `${this.cloneRange.startContainer.parentElement.getBoundingClientRect()
          .top - 90}px`;
        this.wTagPopupleft = `${this.cloneRange.getClientRects()[0].left}px`;
      }
    }, 100);
  }
  public isEqual(refs1: [], refs2: []): boolean {
    // throw new Error("Method not implemented.");
    if (refs1 === refs2) {
      return true;
    }
    let equals = false;
    if (refs1 && refs2) {
      refs1.forEach(f => {
        if (refs2.includes(f)) {
          equals = true;
        }
      });
    }
    return;
    equals;
  }
  public markText() {
    if (
      !(
        this.cloneRange.startContainer === this.cloneRange.endContainer &&
        this.cloneRange.startOffset === this.cloneRange.endOffset
      )
    ) {
      let vereParent = this.cloneRange.commonAncestorContainer as Element;
      while (
        !vereParent.classList ||
        (vereParent.classList &&
          !(vereParent as Element).classList.contains('verse') &&
          !(vereParent.nodeName === 'span'))
      ) {
        vereParent = vereParent.parentNode as Element;
      }
      const startContainer = this.convertRange(
        this.cloneRange.startContainer,
        this.cloneRange.startOffset,
      );
      const endContainer = this.convertRange(
        this.cloneRange.endContainer,
        this.cloneRange.endOffset,
      );
      this.wTags.push({
        id: vereParent.id,
        w: new W(
          range(
            parseInt(startContainer.startID) + startContainer.offSet,
            parseInt(endContainer.startID) + endContainer.offSet,
          ),
        ),
      });
      // console.log(
      //   this.cloneRange.toString() ===
      //     vereParent.textContent.substring(
      //       parseInt(startContainer.startID) + startContainer.offSet,
      //       parseInt(endContainer.startID) + endContainer.offSet,
      //     ),
      // );
      // console.log(this.wTags);

      this.wTags.forEach(eff => {
        const newVerse = [];

        cloneDeep(
          find(this.dataService.verses, v => {
            return v.id === eff.id;
          }),
        ).wTags.forEach(w => {
          if ((w as any).childWTags) {
            const a = new aW();
          } else {
            let x = first(w.id);
            const end = last(w.id);
            for (x; x <= end; x++) {
              // const element = array[x];
              const gg = w;
              gg.id = [];
              gg.id.push(x);
              if (eff.w.id.includes(x)) {
                gg.refs
                  ? gg.refs.push(eff.w.refs[0])
                  : ((gg.refs = []), gg.refs.push(eff.w.refs[0]));

                console.log(eff.w.refs);
              }
              newVerse.push(gg);
            }
          }
        });

        const mergeWTag = [];
        newVerse.forEach(hh => {
          const l = last(mergeWTag);
          if (
            l &&
            this.isEqual(l.refs, hh.refs) &&
            this.isEqual(hh.classList, l.classList)
          ) {
            l.id.push(last(hh.id));
          } else {
            mergeWTag.push(cloneDeep(hh));
          }
        });
        console.log(mergeWTag);
      });
      this.reset();
    }
  }

  public reset() {
    this.cloneRange = undefined;
    this.showPopup = false;
  }

  public showWTagPopup() {
    this.markText();
    this.showPopup = true;
    // if (this.popupTimeout) {
    //   clearTimeout(this.popupTimeout);
    // }
    // this.popupTimeout = setTimeout(() => {
    // }, 2000);
  }
}
