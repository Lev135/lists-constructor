import * as TypeOrm from 'typeorm';
import { User } from '../entities/user';
import { Material } from '../entities/material/material';
import { UserNote } from '../entities/material/user-note';
import { Theme } from '../entities/material/theme';
import { Task } from '../entities/task/task';
import { TaskRemark } from '../entities/task/task-remark';
import { TaskSolution } from '../entities/task/task-solution';
import { List } from '../entities/list/list';
import { ListBlock } from '../entities/list/list-block';
import { ListBlockComment } from '../entities/list/list-block-comment';
import { ListBlockTasks } from '../entities/list/list-block-tasks';
import { ListBlockTaskItem } from '../entities/list/list-block-task-item';
import { options } from './personal-options-process';
import { PdfIndex } from '../entities/pdf-index';
import { LatexField } from '../entities/latex/latex-field';
import { LatexPackage } from '../entities/latex/latex-package';
import { Draft } from '../entities/draft/draft';
import { DraftBlock } from '../entities/draft/draft-block';
import { DraftBlockComment } from '../entities/draft/draft-block-comment';
import { DraftBlockTask } from '../entities/draft/draft-block-task';

export async function startTypeOrm() {
    const connection = await TypeOrm.createConnection({
        type: 'mysql',
        host: options.dataBase.host,
        port: options.dataBase.port,
        username: options.dataBase.user,
        password: options.dataBase.password,
        database: options.dataBase.name,
        logging: options.dataBase.logging,
        logger: options.dataBase.logger,
        synchronize: options.run.syncDataBase,
        entities: [
            User,
            Material, UserNote, Theme,
            Task, TaskRemark, TaskSolution,
            List, ListBlock, ListBlockComment, ListBlockTasks, ListBlockTaskItem,
            Draft, DraftBlock, DraftBlockComment, DraftBlockTask,
            PdfIndex,
            LatexField, LatexPackage
        ]
    });
    return connection;
}
