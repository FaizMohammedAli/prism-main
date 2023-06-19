import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChatgptService } from 'src/chatgpt.service';
import { InstructionModel } from '../models/instructionModel';

@Component({
  selector: 'app-generate-epic',
  templateUrl: './generate-epic.component.html',
  styleUrls: ['./generate-epic.component.css']
})
export class GenerateEpicComponent implements OnInit {

  generatedLogs = [];
  instructionForm: FormGroup;
  logsForm: FormGroup;
  isGeneratingLogs = false;
  areLogsGenerated = false;
  status: any;
  customLogs = [];
  selectedLogs = [];

  constructor(private chatgptService: ChatgptService, private formBuilder: FormBuilder) {
    this.instructionForm = new FormGroup({
      "title": new FormControl(''),
      "description": new FormControl('')
    });

    this.logsForm = new FormGroup({
      "log1": new FormControl('')
    });

    this.customLogs.push({ id: 1, value: "" });
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
    this.generatedLogs = splittedRows.filter(row => row.length !== 0 && row !== '?');

    this.generatedLogs = this.generatedLogs.map(log => {
      return { value: log, checked: false }
    });

    console.log(this.generatedLogs);

    this.areLogsGenerated = true;

  }

  checkValue(idx: number) {
    this.generatedLogs[idx].checked = !this.generatedLogs[idx].checked;

    if (this.generatedLogs[idx].checked === true) {
      this.selectedLogs.push(this.generatedLogs[idx]);
    } else {
      let existIdx = this.selectedLogs.findIndex(log => log.value === this.generatedLogs[idx].value);
      this.selectedLogs.splice(existIdx, 1);
    }

    console.log("final logs, ", this.selectedLogs);
  }

  addNewStory() {
    let newIdx = this.customLogs[this.customLogs.length - 1].id + 1;
    this.logsForm.addControl(`log${newIdx}`, new FormControl(''));
    this.customLogs.push({ id: newIdx, value: "" });

  }

  removeStory(idx: any) {
    if (this.customLogs.length <= 1) {
      return;
    }
    let storyIdx = this.customLogs.findIndex(log => log.id === idx);
    this.logsForm.removeControl(`log${idx}`);
    this.customLogs.splice(storyIdx, 1);
  }

  addStories() {

    this.selectedLogs.forEach(log => {

      let filteredLog = log.value.split(".")[1];

      let model: InstructionModel = {
        field0: filteredLog,
        field1: "ACCEPTANCE CRITERIA " + filteredLog
      };

      this.chatgptService.createEpic(model).subscribe((data) => {
        console.log(data)
      });
    });

    let selectedCustomLogs = Object.keys(this.logsForm.value);

    selectedCustomLogs.forEach((log: string) => {

      let model: InstructionModel = {
        field0: this.logsForm.value[log],
        field1: "ACCEPTANCE CRITERIA " + this.logsForm.value[log]
      };

      this.chatgptService.createEpic(model).subscribe((data) => {
        console.log(data)
      });
    });
  }

}
