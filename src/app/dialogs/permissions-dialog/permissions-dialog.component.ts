import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-permissions-dialog',
  templateUrl: './permissions-dialog.component.html',
  styleUrls: ['./permissions-dialog.component.scss']
})
export class PermissionsDialogComponent implements OnInit {
  displayedColumns: string[] = ['permission', 'owner', 'group', 'public'];
  dataSource = [
    { permission: 'Read', owner: false, group: false, public: false },
    { permission: 'Write', owner: false, group: false, public: false },
    { permission: 'Execute', owner: false, group: false, public: false }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.translatePermissionsFromCode();
  }

  translatePermissionsFromCode() {
    const numericPermissions = this.data.permissions.slice(this.data.permissions.length - 3);
    const ownerBinaryCode = parseInt(numericPermissions.charAt(0), 10).toString(2);
    const groupBinaryCode = parseInt(numericPermissions.charAt(1), 10).toString(2);
    const publicBinaryCode = parseInt(numericPermissions.charAt(2), 10).toString(2);

    for (let i = 0; i < this.dataSource.length; i++) {
      this.dataSource[i].owner = ownerBinaryCode[i] === '0' ? false : true;
      this.dataSource[i].group = groupBinaryCode[i] === '0' ? false : true;
      this.dataSource[i].public = publicBinaryCode[i] === '0' ? false : true;
    }
  }
}
