import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScannerService } from '../../../core/services/scanner.service';

type EmailListMode = 'flagged' | 'all';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss'],
})
export class EmailListComponent implements OnInit {
  emails: any[] = [];
  filteredEmails: any[] = [];

  loading = false;
  deleting = false;

  errorMessage = '';
  successMessage = '';
  searchTerm = '';

  showDeleteModal = false;
  selectedEmailToDelete: any = null;

  mode: EmailListMode = 'flagged';

  constructor(
    private scannerService: ScannerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = data['mode'] === 'all' ? 'all' : 'flagged';
      this.searchTerm = '';
      this.loadEmails();
    });
  }

  loadEmails(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request$ =
      this.mode === 'all'
        ? this.scannerService.getAllEmails()
        : this.scannerService.getFlaggedEmails();

    request$.subscribe({
      next: (data) => {
        this.emails = data || [];
        this.applyCurrentFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Email list loading error:', error);
        this.errorMessage =
          this.mode === 'all'
            ? 'Failed to load scanned emails.'
            : 'Failed to load flagged emails.';
        this.loading = false;
      },
    });
  }

  filterEmails(): void {
    this.applyCurrentFilter();
  }

  private applyCurrentFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredEmails = [...this.emails];
      return;
    }

    this.filteredEmails = this.emails.filter((email) => {
      const text = JSON.stringify(email).toLowerCase();
      return text.includes(term);
    });
  }

  isAllScansMode(): boolean {
    return this.mode === 'all';
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

  getPageEyebrow(): string {
    return this.isAllScansMode() ? 'Scan History' : 'Threat Inbox';
  }

  getPageTitle(): string {
    if (!this.isAllScansMode()) {
      return 'Flagged Emails';
    }

    return this.isAdmin() ? 'All Scanned Emails' : 'My Scanned Emails';
  }

  getPageDescription(): string {
    if (!this.isAllScansMode()) {
      return 'Review suspicious and high-risk emails detected by the scanner service.';
    }

    return this.isAdmin()
      ? 'Review every email scan available across the platform.'
      : 'Review all emails you have scanned and access their analysis results.';
  }

  getLoadingMessage(): string {
    return this.isAllScansMode()
      ? 'Loading scanned emails...'
      : 'Loading flagged emails...';
  }

  getEmptyTitle(): string {
    return this.isAllScansMode()
      ? 'No scanned emails found'
      : 'No flagged emails found';
  }

  getEmptyDescription(): string {
    return this.isAllScansMode()
      ? 'Run a new scan to populate your scan history.'
      : 'No high-risk emails are currently available for review.';
  }

  getEmptyIcon(): string {
    return this.isAllScansMode() ? 'bi-inbox' : 'bi-shield-check';
  }

  getMailIcon(email: any): string {
    const status = this.getStatus(email).toUpperCase();

    if (status === 'FLAGGED') {
      return 'bi-envelope-exclamation-fill';
    }

    if (status === 'SUSPICIOUS') {
      return 'bi-envelope-paper-fill';
    }

    return 'bi-envelope-check-fill';
  }

  openDeleteModal(email: any): void {
    if (!this.isAdmin()) {
      return;
    }

    this.selectedEmailToDelete = email;
    this.showDeleteModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeDeleteModal(): void {
    if (this.deleting) {
      return;
    }

    this.showDeleteModal = false;
    this.selectedEmailToDelete = null;
  }

  confirmDeleteEmail(): void {
    if (!this.selectedEmailToDelete) {
      return;
    }

    const emailId = this.getId(this.selectedEmailToDelete);

    if (!emailId) {
      this.errorMessage = 'Cannot delete email: invalid email ID.';
      this.closeDeleteModal();
      return;
    }

    this.deleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.scannerService.deleteEmail(emailId).subscribe({
      next: () => {
        this.emails = this.emails.filter(
          (email) => this.getId(email) !== emailId,
        );
        this.applyCurrentFilter();

        this.successMessage = `Email #${emailId} deleted successfully.`;
        this.deleting = false;
        this.showDeleteModal = false;
        this.selectedEmailToDelete = null;
      },
      error: (error) => {
        console.error('Delete email error:', error);
        this.errorMessage = 'Failed to delete email.';
        this.deleting = false;
        this.showDeleteModal = false;
      },
    });
  }

  getId(email: any): number {
    return email?.id || email?.emailId || email?.emailMessageId;
  }

  getSender(email: any): string {
    return email?.sender || email?.senderEmail || email?.from || 'Unknown sender';
  }

  getSubject(email: any): string {
    return email?.subject || 'No subject';
  }

  getStatus(email: any): string {
    return email?.status || email?.emailStatus || 'UNKNOWN';
  }

  getRiskLevel(email: any): string {
    return email?.riskLevel || 'N/A';
  }

  getRiskScore(email: any): number {
    return email?.riskScore ?? 0;
  }

  getDate(email: any): string {
    return email?.receivedAt || email?.scannedAt || email?.createdAt || '';
  }

  getStatusClass(status: string): string {
    const value = (status || '').toUpperCase();

    if (value === 'FLAGGED') {
      return 'status-flagged';
    }

    if (value === 'SUSPICIOUS') {
      return 'status-suspicious';
    }

    if (value === 'SAFE') {
      return 'status-safe';
    }

    return 'status-neutral';
  }
}