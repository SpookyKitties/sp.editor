import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as jszip from 'jszip';
import * as localForage from 'localforage';
import * as _ from 'lodash';
import * as pako from 'pako';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private forageRegex: RegExp = new RegExp(
    /(?!\\)[a-zA-Z0-9-_]+\\[a-zA-Z0-9-_]+(?=\.html)/
  );
  constructor(
    public saveState: SaveStateService,
    public navServices: NavigationService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {}

  download(file: string) {
    this.httpClient
      .get('assets/scriptures/' + file + '.zip', {
        observe: 'body',
        responseType: 'arraybuffer'
      })
      .subscribe(async data => {
        // const i = pako.gzip(, {});
        const zip = await jszip.loadAsync(data);
        await zip.forEach(async file2 => {
          const contents = await zip.file(file2).async('text');
          // localStorage.setItem(file2, contents);
          const saveName = this.forageRegex.exec(file2).toString();

          const test = await localForage.getItem(saveName);
          // console.log(test !== null);

          if (!test) {
            await localForage.setItem(saveName, contents).then(() => {
              console.log('finished ' + saveName);
            });
          }
        });
        // console.log(zip);

        console.log('Finished');

        // pako.inflate(data);
      });
  }
}
