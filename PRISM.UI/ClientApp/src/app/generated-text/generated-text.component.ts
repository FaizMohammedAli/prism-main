import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-generated-text',
  templateUrl: './generated-text.component.html',
  styleUrls: ['./generated-text.component.css']
})
export class GeneratedTextComponent implements OnInit {

  @Input() generatedLogs: string[];

  constructor() {
  }

  ngOnInit(): void {
    console.log('from child', this.generatedLogs);
  }

}
