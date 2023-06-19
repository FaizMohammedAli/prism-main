import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'log-in',
  templateUrl: 'log-in.component.html',
  styleUrls: ['log-in.component.css'],
})
export class LogIn {
  rawocmx: string = ' '
  constructor(private title: Title) {
    this.title.setTitle('exported project')
  }
}
