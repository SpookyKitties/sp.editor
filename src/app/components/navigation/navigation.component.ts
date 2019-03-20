import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Navigation } from '../../modelsJson/Navigation';
import { MediaQueryService } from '../../services/media-query.service';
import { NavigationService } from '../../services/navigation.service';
import { SaveStateService } from '../../services/save-state.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Input() public navigation: Navigation;
  @Input() public navigations: Navigation[];
  constructor(
    public navigationService: NavigationService,
    public router: Router,
    public mediaQueryService: MediaQueryService,
    public saveStateService: SaveStateService,
  ) {}

  ngOnInit() {}

  gotoChapter() {
    this.navigation.subNavigationVisible = this.navigation.subNavigationVisible
      ? !this.navigation.subNavigationVisible
      : true;
    this.router.navigateByUrl(`${this.navigation.url}`);
  }
}
