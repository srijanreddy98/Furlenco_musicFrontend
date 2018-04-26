import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { CookieModule } from 'ngx-cookie';
import { ScrollbarModule } from 'ngx-scrollbar';


import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './login/login.component';
import { UserService } from './user/user.service';
import { UserComponent } from './user/user.component';
import { DashboardComponent, CreatePlaylistDialogComponent, AddSongDialogComponent, SharePlaylistURLDialog } from './user/dashboard/dashboard.component';


import { MainComponent } from './main/main.component';
import { VideosListComponent } from './main/videos-list/videos-list.component';
import { VideosPlaylistComponent } from './main/videos-playlist/videos-playlist.component';
import { VideosSearchComponent } from './main/videos-search/videos-search.component';
import { VideoPlayerComponent } from './main/video-player/video-player.component';
// Services
import { YoutubeApiService } from './shared/services/youtube-api.service';
import { YoutubePlayerService } from './shared/services/youtube-player.service';
import { PlaylistStoreService } from './shared/services/playlist-store.service';
import { NotificationService } from './shared/services/notification.service';
import { BrowserNotificationService } from './shared/services/browser-notification.service';
// Pipes
import { VideoDurationPipe } from './shared/pipes/video-duration.pipe';
import { VideoLikesViewsPipe } from './shared/pipes/video-likes-views.pipe';
import { VideoNamePipe } from './shared/pipes/video-name.pipe';
import { LazyScrollDirective } from './shared/directives/lazy-scroll/lazy-scroll.directive';
import { AccountsComponent } from './user/accounts/accounts.component';
const appRoutes = [
  {
    path: 'client/login',
    component: LoginComponent
  },
  {
    path: 'client/user',
    component: UserComponent,
    children: [{
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: 'accounts',
      component: AccountsComponent
    }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    DashboardComponent,
    CreatePlaylistDialogComponent,
    AddSongDialogComponent,
    MainComponent,

    VideosListComponent,
    VideosSearchComponent,
    VideoPlayerComponent,
    VideosPlaylistComponent,

    VideoDurationPipe,
    VideoLikesViewsPipe,
    VideoNamePipe,

    LazyScrollDirective,

    AccountsComponent,SharePlaylistURLDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, {  }),
    CookieModule.forRoot(),
    ScrollbarModule,
    MaterialModule
  ],
  providers: [UserService,
    YoutubeApiService,
    YoutubePlayerService,
    PlaylistStoreService,
    NotificationService,
    BrowserNotificationService],
  bootstrap: [AppComponent],
  entryComponents: [CreatePlaylistDialogComponent, AddSongDialogComponent, SharePlaylistURLDialog]
})
export class AppModule { }
