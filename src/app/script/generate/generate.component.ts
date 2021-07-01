import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

declare function generateScript(model: any): any;
declare function updateForm(model: any): any;

export interface Script {
  title: string;
  description: string;
  path: string;
  controlFields?: FormlyFieldConfig[];
  mainFields?: FormlyFieldConfig[];
}
@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent implements OnInit {
  result: string = "";
  script$!: Observable<Script>;

  controlForm = new FormGroup({});
  controlModel: any = {};
  controlOptions: FormlyFormOptions = {};
  controlFields: FormlyFieldConfig[] = [];

  mainForm = new FormGroup({});
  mainModel: any = {};
  mainOptions: FormlyFormOptions = {};
  mainFields: FormlyFieldConfig[] = []

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  loadScript(path: any = "default") {
    let node = document.createElement('script');
    node.id = 'scriptGenerator';
    node.src = `/assets/js/${path}.js`;
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  unloadScript() {
    document.getElementById('scriptGenerator')?.remove()
  }

  getScript(path: any = "default"): Observable<Script> {
    return this.http.get<Script>(`/assets/script-generator/${path}.json`)
  }

  ngOnInit(): void {
    this.script$ = this.route.paramMap.pipe(
      switchMap((params) => this.getScript(params.get('script')))
    )
    this.route.paramMap.pipe(first()).subscribe(params => this.loadScript(params.get('script')))
  }

  updateForm(controlModel: any): any {
    return updateForm(controlModel)
  }

  generateScript(model: any): void {
    this.result = generateScript(model)
  }

  clear(): void {
    if (this.mainOptions.resetModel) this.mainOptions.resetModel()
    if (this.controlOptions.resetModel) this.controlOptions.resetModel()
  }

}
