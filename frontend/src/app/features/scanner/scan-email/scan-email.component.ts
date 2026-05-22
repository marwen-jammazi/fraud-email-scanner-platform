import { Component } from '@angular/core';
import {
  EmailScanRequest,
  ScannerService,
  ScanResponse,
} from '../../../core/services/scanner.service';

@Component({
  selector: 'app-scan-email',
  templateUrl: './scan-email.component.html',
  styleUrls: ['./scan-email.component.scss'],
})
export class ScanEmailComponent {
  form = {
    sender: '',
    receiverEmail: '',
    subject: '',
    body: '',
  };

  loading = false;
  errorMessage = '';
  result: ScanResponse | null = null;

  constructor(private scannerService: ScannerService) {}

  scanEmail(): void {
    this.errorMessage = '';
    this.result = null;

    if (
      !this.form.sender.trim() ||
      !this.form.receiverEmail.trim() ||
      !this.form.subject.trim() ||
      !this.form.body.trim()
    ) {
      this.errorMessage = 'Please fill all fields before scanning.';
      return;
    }

    const userIdValue = localStorage.getItem('userId');
    const userId = userIdValue ? Number(userIdValue) : undefined;

    if (!userId || Number.isNaN(userId)) {
      this.errorMessage =
        'Cannot scan email: user session is missing. Please login again.';
      return;
    }

    const payload: EmailScanRequest = {
      sender: this.form.sender.trim(),
      receiverEmail: this.form.receiverEmail.trim(),
      subject: this.form.subject.trim(),
      body: this.form.body.trim(),
      receivedAt: this.getCurrentLocalDateTime(),
      userId,
      performedBy: this.getCurrentUserName(),
    };

    this.loading = true;

    this.scannerService.scanEmail(payload).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Scan error:', error);
        this.errorMessage =
          'Failed to scan email. Check scanner-service and ml-service logs.';
        this.loading = false;
      },
    });
  }

  resetForm(): void {
    this.form = {
      sender: '',
      receiverEmail: '',
      subject: '',
      body: '',
    };

    this.result = null;
    this.errorMessage = '';
  }

  getMlProbabilityPercent(): number {
    const probability = this.result?.mlFraudProbability ?? 0;
    return Math.round(probability * 100);
  }

  getScoreWidth(score?: number): string {
    const value = score ?? 0;
    return `${Math.min(Math.max(value, 0), 100)}%`;
  }

  getRiskClass(value?: string): string {
    const risk = (value || '').toUpperCase();

    if (risk.includes('HIGH') || risk.includes('FRAUD')) {
      return 'danger';
    }

    if (risk.includes('MEDIUM') || risk.includes('SUSPICIOUS')) {
      return 'warning';
    }

    if (risk.includes('LOW') || risk.includes('SAFE')) {
      return 'success';
    }

    return 'neutral';
  }

  getStatusClass(value?: string): string {
    const status = (value || '').toUpperCase();

    if (status === 'FLAGGED') {
      return 'danger';
    }

    if (status === 'SUSPICIOUS') {
      return 'warning';
    }

    if (status === 'SAFE') {
      return 'success';
    }

    return 'neutral';
  }

  private getCurrentUserName(): string {
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');

    if (fullName && fullName.trim()) {
      return fullName.trim();
    }

    if (email && email.trim()) {
      return email.trim();
    }

    return 'Unknown User';
  }

  private getCurrentLocalDateTime(): string {
    const now = new Date();
    const pad = (value: number): string => value.toString().padStart(2, '0');

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds(),
    )}`;
  }
}