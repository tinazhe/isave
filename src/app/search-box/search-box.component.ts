import { HttpClient, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Format, Video } from '../app.component';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  loading:boolean = false;
  results = false;
  downloading:boolean = false;
  progress:string = " 0 bytes";
  totalAvailable:boolean = false;
  progressPercentage:string = "0";
  errorMessage:string = "";
  video: Video = {
    iframeUrl:"",
    title:"Create an HTTP tunnel to share your localhost server on the internet via HTTPS with",
    description:"Loading ...",
    thumbnail_url:"dfff",
    formarts:[],
    video_url:""
  };
  selectedQuality:Format = {
    qualityLabel:"320p",
    url:"",
    itag:"22",
    size:""
  };

  constructor(private http: HttpClient) { }

  youtubeForm = new FormGroup({
    url: new FormControl('')
  });
  ngOnInit(): void {
  }

  onSubmit(){
    this.loading = true;
    const options =  { params: new HttpParams().set('url', this.youtubeForm.value.url) };
    this.http.get<Video>('https://powerful-ocean-63122.herokuapp.com/search', options).subscribe( data => {

      this.video = {
        iframeUrl:data.iframeUrl,
        title: data.title,
        description:data.description,
        formarts:data.formarts,
        thumbnail_url:data.thumbnail_url,
        video_url:data.video_url
      };
      this.selectedQuality = this.video.formarts[0];
      this.errorMessage = "";
      this.results = true;
      this.loading = false;
      console.log(this.video);
    },
    (err)=>{
      this.loading = false;
      this.errorMessage = "Video not found";
      console.log("url not found"+ err.message);
    });
  }

  handlePaste(event:any){
    console.log(event.clipboardData.getData('Text'));
    this.youtubeForm.controls["url"].reset;
    this.youtubeForm.controls["url"].patchValue(event.clipboardData.getData('Text'));
    this.onSubmit();
  }

  download(url: string, itag:string): Observable<HttpEvent<Blob>> {

    return this.http.get("https://powerful-ocean-63122.herokuapp.com/download", {
      responseType: 'blob',
      reportProgress:true,
      observe: 'events',
      params: {
        'url':url,
        'itag': itag
      }
    });
  }

   getVideoOld(itag:string, size:string){
    let maxSize = size;
    this.download(this.youtubeForm.value.url, itag).subscribe(event => {

          if (event.type === HttpEventType.DownloadProgress) {
            this.downloading = true;
            console.log(this.formatBytes(event.loaded));
            this.progress = this.formatBytes(event.loaded);
            if(Number(maxSize)){
              this.totalAvailable = true;
              this.progressPercentage = Math.round(event.loaded / Number(maxSize) * 100).toString();
              console.log("Loaded" + Math.round(event.loaded / Number(maxSize) * 100));

            } else{
              this.totalAvailable = false;
              console.log("event total unavailable");
            }

          }
          if (event.type === HttpEventType.Response) {
              this.downloading = false;
              console.log("donwload completed");
              const a = document.createElement('a');
              const objectUrl = URL.createObjectURL(event.body)
              a.href = objectUrl;
              a.download = "isave.mp4";
              a.click();
              URL.revokeObjectURL(objectUrl);
          }


    }, (err)=>{
      console.log(err);
    });
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
