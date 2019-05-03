import { Component, Input, OnInit, Sanitizer } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-aw',
  templateUrl: './aw.component.html',
  styleUrls: ['./aw.component.scss'],
})
export class AWComponent implements OnInit {
  @Input() public w: aW;
  constructor(public sanitizer: DomSanitizer) {}

  public ngOnInit() {}
}
