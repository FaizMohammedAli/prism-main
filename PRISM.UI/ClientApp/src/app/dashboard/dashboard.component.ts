import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatgptService } from 'src/chatgpt.service';
import { InstructionModel } from '../models/instructionModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  generatedLogs = [];
  instructionForm: FormGroup;
  isGeneratingLogs = false;
  areLogsGenerated = false;
  status: any;

  constructor(private chatgptService: ChatgptService) {
    this.instructionForm = new FormGroup({
      "title": new FormControl(''),
      "description": new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  generateBacklogs() {
    let model: InstructionModel = {
      field0: this.instructionForm.controls['title'].value,
      field1: this.instructionForm.controls['description'].value
    };

    this.isGeneratingLogs = true;

    this.chatgptService.getGeneratedBacklogs(model).subscribe((result: string) => {


      let generatedRes = result['Result'];

      this.mapBacklogDataToArray(generatedRes);

      this.status = result['JIRA status'];

      this.isGeneratingLogs = false;

    }, (err) => {

      this.isGeneratingLogs = false;

    });
  }

  mapBacklogDataToArray(backlogs: string) {

    let splittedRows = backlogs.split("\n");
    this.generatedLogs = splittedRows.filter(row => row.length !== 0);
    this.areLogsGenerated = true;

  }


}
