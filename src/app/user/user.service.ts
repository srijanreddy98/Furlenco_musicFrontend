import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class UserService {
    private user = {
        id: '',
        name: '',
        playlist: []
    };
    constructor(private http: Http) { }
    getUser() {
        this.http.get('/api/current_user/?client=true').subscribe(
            (res) => {
                const body = JSON.parse(res['_body']);
                this.user.id = body['_id'];
                this.http.get('/api/playlist/?id=' + this.user.id).subscribe(
                    (res) => {
                        for (let i of JSON.parse(res['_body'])) {
                            var songs= [];
                            for (let j of i.songs) {
                                songs.push(JSON.parse(j));
                            }
                            i.songs = songs;
                            this.user.playlist.push(i);
                        }
                }
                );
            },
            (err) => console.log(err)
        );
    }
    getPlaylist() {
        this.http.get('/api/playlist/?id = ' + this.user.id);
    }
    postNewPlaylist(body) {
        body.id = this.user.id;
        console.log('A',body,'A');
        this.http.post('/api/createPlaylist', body).subscribe(
            (res) => {
                this.user.playlist.push(JSON.parse(res['_body']));
                return true;
            }
        );
    }
    addSongToPlaylist(body) {
        console.log('A', body, 'A');
        this.http.post('/api/addSong/', body).subscribe(
            (res) => {console.log(JSON.parse(res['_body']));
            for (const i in this.user.playlist) {
                if (this.user.playlist[i]['_id'] === body.id) this.user.playlist[i].songs.push(i);
            }
        
        }
        );

    }
    getUserData(){
        return Observable.of(this.user);
    }
    logout() {
        return this.http.get('/api/logout');
    }
    addSharedPlaylist(id) {
        this.http.post('/api/sharedPlaylist', {id: id, user: this.user.id}).subscribe(
            (res) => {console.log(res); this.getUser;}
        );
    }
}
