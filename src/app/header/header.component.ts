import { Component, OnInit, NgZone } from '@angular/core';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faBookOpen,
  faCaretDown,
  faGlobe,
  faListUl,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { ChapterService } from '../services/chapter.service';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faBars = faBars;
  faParagraph = faParagraph;
  faBookOpen = faBookOpen;
  faPlus = faPlus;
  faListUl = faListUl;
  faGlobe = faGlobe;
  faCaretDown = faCaretDown;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  // leftPaneNav: HTMLElement;
  constructor(
    public helperService: HelperService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    private router: Router,
    private location: Location,
    private ngZone: NgZone
  ) {
    // this.leftPaneNav = document.getElementById('leftPaneNav');
  }

  ngOnInit() {}

  toggleNotes() {
    this.navServices.toggleNotes();
  }

  addressBarKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      let addressBarValue = (document.getElementById(
        'addressBar'
      ) as HTMLInputElement).value;
      addressBarValue = addressBarValue.replace('/', ' ');
      const address = addressBarValue.split(' ').filter(f => {
        return f.trim() !== '';
      });
      console.log(address);
      if (address.length >= 2) {
        this.router.navigateByUrl(address[0] + '/' + address[1]);
        // this.chapterService.getChapter(address[0], address[1]);
      }
    }
  }

  btnBackPress() {
    this.ngZone.run(() => {
      let strFound = window.find('moses');
      if (!strFound) {
        strFound = window.find('moses', 0, 1, 1);
        while (window.find('moses', 0, 1, 1)) continue;
      }
    });

    // this.location.back();
  }
  btnForwardPress() {
    this.location.forward();
  }
  // toggleNavButton(id: string, targetId: string, on: string, off: string) {
  //   this.navServices.toggleNavButton(id, targetId, on, off);
  // }
  btnNewNotesPress() {
    this.navServices.btnNewNotesPress();
  }
  btnPoetryPress() {
    this.navServices.btnPoetryPress();
  }
  btnEnglishNotesPress() {
    this.navServices.btnEnglishNotesPress();
  }
  btnTranslatorNotesPress() {
    this.navServices.btnTranslatorNotesPress();
  }
  btnOriginalNotesPress() {
    this.navServices.btnOriginalNotesPress();
  }
  btnRightPanePress() {
    this.navServices.btnRightPanePress();
  }
  btnNotesSettingsPress() {
    // const dialogConfig = new MatDialogConfig();

    // this.dialog.open(DialogBodyComponent, { width: '0px', height: '0px' });
    this.navServices.btnNotesSettingsPress();
  }
  btnSecondaryNotesPress() {
    this.navServices.btnSecondaryNotesPress();
    this.chapterService.resetNotes();
  }
  btnLeftPanePress() {
    this.navServices.btnLeftPanePress();
  }
  btnParagraphPress() {
    this.navServices.btnParagraphPress();
  }
}
