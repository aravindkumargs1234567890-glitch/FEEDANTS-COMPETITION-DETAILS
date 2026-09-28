import { ICompetition, ILifecycleState, IRegistration, ISubmission, IUser } from '../types/index.ts';

export interface CompetitionDetailsResponse {
  competition: ICompetition;
  lifecycle: ILifecycleState;
  userRegistration: IRegistration | null;
  userSubmission: ISubmission | null;
  serverTime: string;
}

export class ApiClient {
  static async getCompetitionDetails(
    competitionId: string = 'comp_classical_dance_001',
    userId?: string
  ): Promise<CompetitionDetailsResponse> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    const res = await fetch(`/api/competitions/${competitionId}?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load competition details');
    }
    return data.data;
  }

  static async registerUser(
    competitionId: string,
    userId: string,
    paymentMethod: string = 'razorpay'
  ): Promise<{
    registration: IRegistration;
    competition: ICompetition;
    lifecycle: ILifecycleState;
    remainingSpots: number;
  }> {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competitionId, userId, paymentMethod }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data.data;
  }

  static async submitEntry(payload: {
    userId: string;
    competitionId: string;
    submissionUrl: string;
    title?: string;
    performanceNotes?: string;
    fileType?: string;
  }): Promise<ISubmission> {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Submission upload failed');
    }
    return data.data;
  }

  static async cancelRegistration(registrationId: string): Promise<any> {
    const res = await fetch(`/api/registrations/${registrationId}/cancel`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to cancel registration');
    }
    return data.data;
  }

  static async listUsers(): Promise<IUser[]> {
    const res = await fetch('/api/users');
    const data = await res.json();
    return data.data || [];
  }

  static async createUser(userData: { name: string; email: string; phone?: string; city?: string }): Promise<IUser> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create user');
    return data.data;
  }

  static async setLifecycleScenario(competitionId: string, scenario: string): Promise<any> {
    const res = await fetch(`/api/competitions/${competitionId}/lifecycle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  static async resetDatabase(): Promise<void> {
    const res = await fetch('/api/competitions/reset', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
  }

  static async runConcurrencyTest(totalRequests: number = 10, simulateDuplicates: boolean = false): Promise<any> {
    const res = await fetch('/api/concurrency/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalRequests, simulateDuplicates }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
}
