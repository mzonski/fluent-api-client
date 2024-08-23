export type SemVerFormat = string &
	(`${'v' | ''}${number}` | `${'v' | ''}${number}.${number}` | `${'v' | ''}${number}.${number}.${number}`);
