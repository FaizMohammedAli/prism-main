import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InstructionModel } from './app/models/instructionModel';

@Injectable({
  providedIn: 'root'
})
export class ChatgptService {

  getBacklogsUrl: string = "https://eoo5ysdz6vamy9a.m.pipedream.net";

  createEpicUrl: string = "https://eobefcg6qiwuirs.m.pipedream.net";
  
  constructor(private http: HttpClient) { }

  getGeneratedBacklogs(model: InstructionModel) {
    return this.http.post(this.getBacklogsUrl, model);
  }

  createEpic(model: InstructionModel) {
    return this.http.post(this.createEpicUrl, model);
  }

}
