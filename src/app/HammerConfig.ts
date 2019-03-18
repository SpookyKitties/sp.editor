import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides: any = {
    pinch: { enable: false },
    rotate: { enable: false },
    swipe: {
      velocity: 1,
      threshold: 200,
    },
  } as any;
  options: any = {
    cssProps: {
      userSelect: undefined
    }
  } as any;
}
