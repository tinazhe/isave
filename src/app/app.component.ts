import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


export interface Video{
  size720p:string,
  iframeUrl: string,
  title: string,
  description:string,
  thumbnail_url:string,
  formarts: Array<Format>
  video_url: any
}

export interface Download {
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  progress: number
  content: Blob | null
}

export interface Format{
    qualityLabel: string,
    url: string,
    itag: string,
    size: string
}
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  loading:boolean = false;

  constructor(private router: Router) { }
  ngOnInit() {

}



}
