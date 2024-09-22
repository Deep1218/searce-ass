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

  private _planners: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getProject$() {
    return this._project.asObservable();
  }
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

  getProject(id: number) {
    return this.http.get(`/projects/${id}`).pipe(
      tap((response: any) => {
        this._project.next(response.data);
      })
    );
  }

  create(data: any) {
    this.socketService.emit('project:create', data);
  }
  createdlistner() {
    return this.socketService.listen('project:created');
  }
  getPlanners() {
    return this.http.get('/users/').pipe(
      tap((res: any) => {
        this._planners.next(res.data);
      })
    );
  }
}
