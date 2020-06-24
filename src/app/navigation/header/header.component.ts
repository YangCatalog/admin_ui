import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/others/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() public sidenavToggle = new EventEmitter();

    constructor(readonly authService: AuthService) {}

    ngOnInit() {}

    onToggleSidenav = () => {
        this.sidenavToggle.emit();
    };

    onLogOutClick() {
        this.authService.logOut();
    }
}
