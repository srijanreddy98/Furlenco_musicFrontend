import { Component, OnInit, Inject } from '@angular/core';
import {getMetadata} from 'youtube-parser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UserService } from '../user.service';
import {  Input, Output, EventEmitter } from '@angular/core';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { PlaylistStoreService } from '../../shared/services/playlist-store.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  notes = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
  ind = 0;
  sel = false;
  shareAdd = false;
  shareCodeId ='';
  constructor(public dialog: MatDialog, private userService: UserService, private youtubePlayer: YoutubePlayerService,
    private playlistService: PlaylistStoreService) { }
  user;
  ngOnInit() {
    this.userService.getUserData().subscribe(
      (res) => { this.user = res; console.log(this.user) }
    );
    
  }
  play(video: any): void {
      this.youtubePlayer.playVideo(video.split('?v=')[1], 'video.snippet.title');
    }
  openDialog(): void {
    const dialogRef = this.dialog.open(CreatePlaylistDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        console.log('reached');
      }
    });
  }
  openDialogSong(i): void {
    const dialogRef = this.dialog.open(AddSongDialogComponent, {
      width: '350px',
      data: {id: this.user.playlist[i]['_id']}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        console.log('reached');
      }
    });
  }
  AddPlaylist() {
    this.userService.addSharedPlaylist(this.shareCodeId);
  }
  share(id) {
    console.log(id);
    const dialogRef = this.dialog.open(SharePlaylistURLDialog, {
      width: '350px',
      data: id['_id']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        console.log('reached');
      }
    });
  }
}




@Component({
  template: `
  <h3 mat-dialog-title>
  Create Playlist
  </h3>
    <mat-dialog-content>
    <mat-form-field class="example-full-width">
    <input matInput placeholder="Name" [(ngModel)] = "playlistName">
  </mat-form-field>
    <mat-form-field class="demo-chip-list">
  <mat-chip-list #chipList>
    <mat-chip *ngFor="let fruit of fruits" [selectable]="selectable"
             [removable]="removable" (remove)="remove(fruit)">
      {{fruit.name}}
      <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
    </mat-chip>
    <input placeholder="Tags..."
           [matChipInputFor]="chipList"
           [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
           [matChipInputAddOnBlur]="addOnBlur"
           (matChipInputTokenEnd)="add($event)" />
  </mat-chip-list>
</mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button color = "primary" (click) = "create()" >Create</button>
      <button mat-button color = "warn" (click) = "dialogRef.close('false')" >Cancel</button>
    </mat-dialog-actions>
  `
})
export class CreatePlaylistDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreatePlaylistDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  playlistName = '';
  onNoClick(): void {
    this.dialogRef.close();
  }
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  error = false;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  fruits = [
  ];


  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  create() {
    console.log(this.playlistName);
    
    const body = {
      tags : this.fruits,
      name : this.playlistName
    };
    console.log(body);
    const result = this.userService.postNewPlaylist(body);
    if (result) {
      this.dialogRef.close(true);
    } else {
      this.error = true;
    }
  }
}
@Component({
  template: `
  <h3 mat-dialog-title>
  Add Song
  </h3>
    <mat-dialog-content>
    <mat-form-field class="example-full-width">
    <input matInput placeholder="URL" [(ngModel)] = "url">
  </mat-form-field>
  <p style="color:red ; font-size:65%" *ngIf="err">
      Please enter a valid url
    </p>
  <mat-form-field class="example-full-width">
    <input matInput placeholder="Name" [(ngModel)] = "name">
  </mat-form-field>

    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button color = "accent" (click) = "checkURL('kk')" >Add</button>
      <button mat-button color = "warn" (click) = "dialogRef.close('false')" >Cancel</button>
    </mat-dialog-actions>
  `
})
export class AddSongDialogComponent {
  name = '';
  url = '';
  err = false;
  constructor(
    public dialogRef: MatDialogRef<AddSongDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  checkURL(url) { 
    url = this.url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
var match = url.match(regExp);
if (match && match[2].length == 11) {
  console.log('Here');
  // Do anything for being valid
  // if need to change the url to embed url then use below line
  this.create();
}
else {
  // Do anything for not being valid
  console.log('Here2');
  this.err = true;
}
  }
  create() {
    this.userService.addSongToPlaylist({name: this.name, url:this.url, id: this.data.id});
  }
}
@Component({
  template: `
  {{data}}
  `
})
export class SharePlaylistURLDialog {
  constructor(
    public dialogRef: MatDialogRef<SharePlaylistURLDialog>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
