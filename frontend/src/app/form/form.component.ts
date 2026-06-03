import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FilterMacrotemasComponent } from '../filter-macrotemas/filter-macrotemas.component';
import { FilterTemasComponent } from "../filter-temas/filter-temas.component";
import { FormsModule } from '@angular/forms';
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FilterMacrotemasComponent,
    FilterTemasComponent,
    FormsModule,
    RecaptchaModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {

  data = [
    { value: 'temas-estrategicos', label: 'Temas Estratégicos' },
    { value: 'macrotemas', label: 'Macrotemas' },
  ];

  isDropdownOpen = false;
  selectedData: any[] = [];

  // RECAPTCHA
  mostrarCaptcha = false;
  captchaTokenV2: string | null = null;
  captchaTokenV3: string | null = null;

  private http = inject(HttpClient);
  private recaptchaV3Service = inject(ReCaptchaV3Service);

  // BOTÃO ENVIAR
  enviaEmail() {

    // PRIMEIRO CLIQUE → executa V3 + mostra V2
    if (!this.mostrarCaptcha) {

      this.recaptchaV3Service.execute('submit').subscribe((token: string) => {
        console.log('TOKEN V3:', token);
        this.captchaTokenV3 = token;
      });

      this.mostrarCaptcha = true;
      return;
    }

    // BLOQUEIO SE V2 NÃO FOI RESOLVIDO
    if (!this.captchaTokenV2) {
      alert('Confirme o captcha!');
      return;
    }

    // ENVIO COM OS DOIS TOKENS
    this.http.post('http://localhost:8000/api/validate-recaptcha', {
      token_v2: this.captchaTokenV2,
      token_v3: this.captchaTokenV3
    }).subscribe({
      next: (data: any) => {
        console.log('SUCESSO:', data);
      },
      error: (err: any) => {
        console.error('ERRO:', err);
      },
    });
  }

  // CALLBACK V2
  onCaptchaResolved(token: string | null) {
    console.log('TOKEN V2:', token);

    if (!token) return;

    this.captchaTokenV2 = token;

    // continua o fluxo
    this.enviaEmail();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectData(item: any) {
    const ind = this.selectedData.findIndex((x) => x.value === item.value);

    if (ind == -1) {
      this.selectedData = [...this.selectedData, item];
    } else {
      this.selectedData = this.selectedData.filter(x => x.value !== item.value);
    }
  }

  isItemSelected(item: any): boolean {
    return this.selectedData.some((x) => x.value === item.value);
  }

  placeholderData(): string {
    if (this.selectedData.length == 0) {
      return "Selecione os conjuntos de dados desejados";
    }

    return this.selectedData.map(item => item.label).join(', ');
  }
}