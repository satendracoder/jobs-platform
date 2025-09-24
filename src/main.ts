import { Component, HostListener, Inject, PLATFORM_ID } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  provideRouter,
  Router,
} from "@angular/router";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { routes } from "./app/app.routes";
import { HeaderComponent } from "./app/components/header/header.component";
import { FooterComponent } from "./app/components/footer/footer.component";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { ScAngularLoader, iloadersInterceptor } from "sc-angular-loader";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ScAngularLoader,
  ],
  template: `
    <sc-angular-loader
      type="spinner"
      class="spinner-1"
      color="#ff5722"
      background="rgba(0,0,0,0.2)"
      width="60px"
      height="60px"
    >
    </sc-angular-loader>
    <div class="app">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class App {
  // Scroll Button
  showScroll: boolean = false;
  isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.scrollToTop();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.scrollToTop();
      }
    });
  }

  // Scroll Button
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (!this.isBrowser) return; // SSR ke liye safe guard
    this.showScroll = window.scrollY > 300;
  }

  scrollToTop() {
    if (!this.isBrowser) return; // SSR ke liye safe guard
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([iloadersInterceptor])),
  ],
});
