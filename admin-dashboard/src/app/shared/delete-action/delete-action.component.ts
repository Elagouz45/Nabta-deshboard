import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { LucideTrash2, LucideTriangleAlert } from '@lucide/angular';
import { TrashEntityType } from '../../core/trash/trash.models';
import { TrashService } from '../../core/trash/trash.service';
import { ActionMenuComponent, ActionMenuItem } from '../action-menu/action-menu.component';
import { AppDialogComponent } from '../app-dialog/app-dialog.component';

const DELETE_ACTION: readonly ActionMenuItem[] = [{ id: 'delete', label: 'حذف', danger: true }];

@Component({
  selector: 'app-delete-action',
  imports: [ActionMenuComponent, AppDialogComponent, LucideTrash2, LucideTriangleAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-action-menu [label]="'إجراءات ' + entityLabel()" [items]="actions" (selected)="open()"/>
    @if (confirming()) {
      <app-dialog [title]="'حذف ' + entityKindLabel() + '؟'" [subtitle]="entityLabel()" (closed)="close()">
        <div class="delete-confirmation">
          <span class="delete-icon"><svg lucideTrash2></svg></span>
          <p>هل تريد حذف <strong>{{entityLabel()}}</strong>؟</p>
          @if(financialRecord()){<aside><svg lucideTriangleAlert></svg><span>تنبيه: حذف هذا السجل قد يؤثر في دقة السجل المالي والتقارير.</span></aside>}
          <small>سينتقل العنصر إلى سلة المهملات لمدة 30 يومًا، ويمكن استعادته خلالها قبل الحذف النهائي.</small>
        </div>
        <div dialog-actions><button class="cancel" type="button" (click)="close()">إلغاء</button><button class="confirm" type="button" (click)="confirm()">نعم، حذف</button></div>
      </app-dialog>
    }`,
  styles: [`.delete-confirmation{text-align:center}.delete-icon{display:grid;place-items:center;width:3.5rem;height:3.5rem;margin:0 auto 1rem;border-radius:50%;background:#fdeceb;color:#c83d3d}.delete-icon svg{width:1.55rem}.delete-confirmation p{margin:.2rem 0 .75rem;color:var(--text);font-size:1rem}.delete-confirmation small{display:block;color:var(--muted);line-height:1.8}.delete-confirmation aside{display:flex;align-items:flex-start;gap:.5rem;margin:.75rem 0;padding:.75rem;border:1px solid #efc48d;border-radius:.65rem;background:#fff8ed;color:#8d5718;text-align:right}.delete-confirmation aside svg{width:1.1rem;flex:none}.cancel,.confirm{min-width:8rem;padding:.68rem 1rem;border-radius:.55rem;font:inherit;font-weight:700;cursor:pointer}.cancel{border:1px solid var(--border);background:#fff;color:var(--text)}.confirm{border:1px solid #c83d3d;background:#c83d3d;color:#fff}`]
})
export class DeleteActionComponent {
  readonly entityId = input.required<string>(); readonly entityType = input.required<TrashEntityType>(); readonly entityLabel = input.required<string>(); readonly entityKindLabel = input('العنصر'); readonly sourceRoute = input.required<string>(); readonly snapshot = input.required<unknown>(); readonly financialRecord = input(false); readonly deleted = output<void>(); readonly confirming = signal(false); readonly actions = DELETE_ACTION;
  constructor(private readonly trash: TrashService) {}
  open(): void { this.confirming.set(true); }
  close(): void { this.confirming.set(false); }
  confirm(): void { this.trash.archive({ entityId: this.entityId(), entityType: this.entityType(), entityLabel: this.entityLabel(), sourceRoute: this.sourceRoute(), financialRecord: this.financialRecord(), snapshot: this.snapshot() }); this.deleted.emit(); this.close(); }
}

