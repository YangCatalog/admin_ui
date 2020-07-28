import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { TextEditorComponent } from 'src/app/components/text-editor/text-editor.component';
import { NginxService } from '../../nginx.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-nginx',
  templateUrl: './nginx.component.html',
  styleUrls: ['./nginx.component.scss']
})
export class NginxComponent implements OnInit {
  isLoadingFiles = true;
  isLoadingContent = false;
  form: FormGroup;
  configText: string = null;
  error = false;
  selectedNginxConf: string;
  nginxConfigNames: string[] = [];

  @ViewChild('textEditor') textEditor: TextEditorComponent;

  constructor(
    private nginxService: NginxService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.buildForm();
    this.nginxService.fetchConfigNames()
    .pipe(finalize(() => (this.isLoadingFiles = false)))
    .subscribe(
      response => {
        this.nginxConfigNames = response.data;
      },
      err => {
        console.log(err);
        this.error = true;
      }
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'nginxConfigName': ['', Validators.required]
    });
  }

  formSubmit() {
    this.isLoadingContent = true;
    this.selectedNginxConf = this.form.value.nginxConfigName;
    this.fetchConfig();
  }

  fetchConfig() {
    this.nginxService.fetchConfig(this.selectedNginxConf)
    .pipe(finalize(() => (this.isLoadingContent = false)))
    .subscribe(
      response => {
        this.configText = response.data;
      },
      err => {
        this.error = true;
        console.log(err);
      }
    );
  }

  saveChange(editedConfig: string) {
    this.textEditor.startLoading();
    this.nginxService.saveConfig(editedConfig)
    .pipe(finalize( () => {
      this.textEditor.stopLoading()
    } ))
    .subscribe(
      response => {
        this.textEditor.disableConfigEdit();
        this.textEditor.showSuccess();
      },
      err => {
        this.textEditor.showError();
      }
    );
  }

}
