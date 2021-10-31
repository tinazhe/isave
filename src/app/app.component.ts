import { Component } from '@angular/core';


export interface Video{
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  loading:boolean = false;

  constructor() { }

}
