import { Component, OnInit } from '@angular/core';
import { File } from '../file';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  private baseFolder: string;
  private files: File;

  constructor(baseFolder: string) {
    this.baseFolder = baseFolder;
  }

  ngOnInit() {}
}
