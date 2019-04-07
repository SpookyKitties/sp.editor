import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { first, isEmpty, last } from 'lodash';
import { TemplateGroup } from '../../modelsJson/TemplateGroup';
import { Verse } from '../../modelsJson/Verse';
import { W } from '../../modelsJson/W';
import { ChapterService } from '../../services/chapter.service';
import { DataService } from '../../services/data.service';
import { EditService } from '../../services/EditService';
// import { Verse } from '../../modelsJson/Verse';
import { SaveStateService } from '../../services/save-state.service';
import { StringService } from '../../services/string.service';
// import { VerseSelectService } from '../../services/verse-select.service';
import { WTagService } from '../../services/wtag-builder.service';
@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerseComponent implements OnInit {
  @ViewChild('span') public span!: ElementRef;
  @Input() public verse: Verse;
  constructor(
    public wTagBuilderService: WTagService,
    public saveState: SaveStateService,
    // public verseSelectService: VerseSelectService,
    public sanitizer: DomSanitizer,
    public stringService: StringService,
    public chapterService: ChapterService,
    public dataService: DataService,
  ) {}
  public animateNotesPane(): Promise<void> {
    return new Promise<void>(resolve => {
      if (!this.saveState.data.notesPanePin.value) {
        this.saveState.data.notesPanePin.value = true;

        this.saveState.data.notesPanePin.animated = true;
        setTimeout(() => {
          this.saveState.data.notesPanePin.animated = false;
          resolve();
        }, 400);
      } else {
        resolve();
      }
    });
  }
  public filterClassList(classList: string[]) {
    if (!classList) {
      return '';
    }

    return classList.toString().replace(',', ' ');
  }

  public ngOnInit() {}
  public selectText() {
    const range = window.getSelection().getRangeAt(0);
    if (
      !(
        range.startContainer === range.endContainer &&
        range.startOffset === range.endOffset
      )
    ) {
      const startContainer = range.startContainer.parentElement;
      const endContainer = range.endContainer.parentElement;
      const sC = {
        startID: first(
          range.startContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        lastID: last(
          range.startContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        offSet: range.startOffset,
      };
      const eC = {
        startID: first(
          range.endContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        lastID: last(
          range.endContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        offSet: range.endOffset,
      };
      if (range.startContainer === range.endContainer) {
        console.log(
          range.startContainer.textContent.substring(sC.offSet, eC.offSet),
        );
      }
    }
  }

  public wTagClick(w: W) {
    if (!w.visibleRefs) {
      return;
    }

    if (isEmpty(w.visibleRefs)) {
      this.chapterService.resetNotes();
    } else {
      if (w.clicked) {
        this.wTagSelect(w);
      } else {
        this.chapterService.resetNotes().then(() => {
          w.clicked = true;

          this.wTagSelect(w);
        });
      }
    }
    // console.log(w.visibleRefs);
  }

  private resetNotes(): Promise<void> {
    return new Promise<void>(resolve => {
      this.chapterService
        .resetNoteVisibility(
          this.dataService.chapter2,
          this.dataService.noteVisibility,
        )
        .then(() => {
          this.chapterService
            .buildWTags(
              this.dataService.verses,
              this.dataService.noteVisibility,
            )
            .then(() => {
              resolve();
            });
        });
    });
  }

  private wTagSelect(w: W) {
    return new Promise<void>(async resolve => {
      const ref = w.visibleRefs.pop();
      w.selected = true;
      this.dataService.verses.forEach(verse => {
        verse.wTags.forEach(wTag => {
          if (wTag.visibleRefs && wTag.visibleRefs.includes(ref)) {
            wTag.selected = true;
          }
        });
      });

      this.dataService.chapter2.notes.forEach(note => {
        note.secondary.forEach(secondaryNote => {
          secondaryNote.clicked = secondaryNote.id === ref;
        });
      });

      await this.animateNotesPane();

      if (ref) {
        document.getElementById(ref).scrollIntoView();
      }
      resolve();
    });
  }
}
