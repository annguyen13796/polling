export interface IRepository<T> {
	create(domain: T): Promise<void>;
	update(domain: T): Promise<void>;
}
