import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/evironment';
import { BehaviorSubject, tap } from 'rxjs';
import { SocketService } from '../shared/socket.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private _projects: BehaviorSubject<any> = new BehaviorSubject(null);
  private _project: BehaviorSubject<any> = new BehaviorSubject(null);
  private _pagination: BehaviorSubject<any> = new BehaviorSubject(null);
  projectId!: string;

  private _planners: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getAllProjects$() {
    return this._projects.asObservable();
  }
  getProjectsPagination$() {
    return this._pagination.asObservable();
  }

  getPlanners$() {
    return this._planners.asObservable();
  }

  getProjects() {
    return this.http.get(`/projects/`).pipe(
      tap((response: any) => {
        this._projects.next(response.data);
      })
    );
  }

  getProject() {
    return this.http.get(`/projects/${this.projectId}`);
  }

  create(data: any) {
    this.socketService.emit('project:create', data);
  }
  createdlistner() {
    return this.socketService.listen('project:created');
  }
  update(data: any) {
    this.socketService.emit('project:update', data);
  }
  updateListner() {
    return this.socketService.listen('project:updated');
  }

  getPlanners() {
    return this.http.get('/users/').pipe(
      tap((res: any) => {
        this._planners.next(res.data);
      })
    );
  }
  // Positions
  getPositions(search: string, searchBy: string) {
    return this.http.get(`/positions/project/${this.projectId}`, {
      params: { search, searchBy },
    });
  }

  deletePosition(id: string) {
    return this.http.delete(`/positions/${id}`);
  }
  createPosition(data: any) {
    this.socketService.emit('position:create', data);
  }
  createPositionListner() {
    return this.socketService.listen('position:created');
  }
}
