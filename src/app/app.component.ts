import { HttpClient, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import {  FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

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
    itag: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'isave';
  results = false;
  loading:boolean = false
  video: Video = {
    iframeUrl:"",
    title:"Create an HTTP tunnel to share your localhost server on the internet via HTTPS with",
    description:"Loading ...",
    thumbnail_url:"dfff",
    formarts:[],
    video_url:""
  };
  selectedQuality:Format = {
    qualityLabel:"720p",
    url:"",
    itag:"22"
  };
  downloading:boolean = true;
  progress:string = " 0 bytes";
  totalAvailable:boolean = false;
  progressPercentage:string = "0%";

  constructor(private http: HttpClient) { }

  youtubeForm = new FormGroup({
    url: new FormControl('')
  });

  getVideo(){
    this.download( this.youtubeForm.value.url).subscribe(event => {

          if (event.type === HttpEventType.DownloadProgress) {
            this.downloading = true;
            console.log(this.formatBytes(event.loaded));
            this.progress = this.formatBytes(event.loaded);
            if(event.total){
              this.totalAvailable = true;
              this.progressPercentage = Math.round(event.loaded / event.total * 100).toString();
              console.log("Loaded" + Math.round(event.loaded / event.total * 100));

            } else{
              console.log("event total unavailable");
            }

          }
          if (event.type === HttpEventType.Response) {
              this.downloading = false;
              console.log("donwload completed");
              const a = document.createElement('a')
              const objectUrl = URL.createObjectURL(event.body)
              a.href = objectUrl
              a.download = `${this.video.title} isave.mp4`;
              a.click();
              URL.revokeObjectURL(objectUrl);
          }


    })
  }

  download(url: string): Observable<HttpEvent<Blob>> {

    return this.http.get("https://powerful-ocean-63122.herokuapp.com/download", {
      reportProgress:true,
      observe:'events',
      responseType: 'blob',
      params: {
        'url':url,
        'itag': this.selectedQuality.itag
      }
    });
  }


  onSubmit(){
    this.loading = true;
    const options =  { params: new HttpParams().set('url', this.youtubeForm.value.url) };
    this.http.get<Video>('https://powerful-ocean-63122.herokuapp.com/search', options).subscribe( data => {
      console.log(data);

      this.video = {
        iframeUrl:data.iframeUrl,
        title: data.title,
        description:data.description,
        formarts:data.formarts,
        thumbnail_url:data.thumbnail_url,
        video_url:data.video_url
      };
      this.results = true;
      this.loading = false;
      console.log(this.video);
    });
  }

  prhogress(){

  }

   formatBytes(bytes:number, decimals = 2):string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
}
