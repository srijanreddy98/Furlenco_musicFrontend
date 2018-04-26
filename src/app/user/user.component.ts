import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { MatSnackBar } from '@angular/material';
import { UserService } from './user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Howl } from 'howler';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user = '';
  sound;
  roll = '';
  isAdmin = false;
  numbe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  constructor(private userService: UserService, public dialog: MatDialog, private router: Router) { }
  atten = [];
  filteredSubs = [];
  selectedSub = [];
  filteredRec = [];
  selectedClass = '';
  showRecords = false;
  showType = 'All';
  ngOnInit() {
    this.userService.getUser();
  }
  inArray(needle) {
    const count = this.atten.length;
    for (let i = 0; i < count; i++) {
      if (this.atten[i].class === needle) { return i; }
    }
    return -1;
  }
  selectedToggleChange(i) {
    this.showType = i.value;
    if (i.value !== 'All') {
    this.filteredRec = this.selectedSub.filter( j => j.p_a === this.showType);
    } else {
    this.filteredRec = this.selectedSub;
    }
  }
  applyFilterSubjects( filterValue ) {
      if (!filterValue) {
        this.filteredSubs = this.atten;
      }
    this.filteredSubs = this.atten.filter(i => i.class.indexOf(filterValue) >= 0);
      // filterValue = filterValue.trim(); // Remove whitespace
      // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      // this.dataSource.filter = filterValue;
      // this.filteredusers=filterValue;
  }
  logout() {
    console.log('logout');
    this.userService.logout().subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
    this.router.navigate(['/client', 'login']);
  }
}
