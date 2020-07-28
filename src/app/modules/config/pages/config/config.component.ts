import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../config.service';
import { finalize } from 'rxjs/operators';
import { TextEditorComponent } from 'src/app/components/text-editor/text-editor.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  isLoading = true;
  configText: string;
  error = false;

  @ViewChild('textEditor') textEditor: TextEditorComponent;

  constructor(
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.fetchConfig();
  }

  fetchConfig() {
    this.configService.fetchConfig()
      .pipe(finalize(() => (this.isLoading = false)))
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
    this.configService.saveConfig(editedConfig)
      .pipe(finalize(() => {
        this.textEditor.stopLoading();
      }))
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
