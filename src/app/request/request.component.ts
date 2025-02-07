import { Component, OnInit } from '@angular/core';
import { CollecteService } from '../services/collecte.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  collectes: any[] = [];
  userId: number | null = null;

  constructor(private collecteService: CollecteService) {}

  ngOnInit() {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
    }

    if (this.userId) {
      this.collecteService.getCollectes().subscribe((data) => {
        this.collectes = data.filter(collecte => collecte.userId === this.userId);
      });
    }
  }
}
