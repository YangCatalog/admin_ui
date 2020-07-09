import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { TextEditorComponent } from 'src/app/components/text-editor/text-editor.component';
import { NginxService } from '../../nginx.service';

@Component({
  selector: 'app-nginx',
  templateUrl: './nginx.component.html',
  styleUrls: ['./nginx.component.scss']
})
export class NginxComponent implements OnInit {
  isLoading = true;
  configText: string;
  error = false;

  @ViewChild('textEditor') textEditor: TextEditorComponent;

  constructor(private nginxService: NginxService) { }

  ngOnInit(): void {
    this.fetchConfig();
  }

  fetchConfig() {
    this.nginxService.fetchConfig()
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe(
      response => {
        this.configText = response;
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
