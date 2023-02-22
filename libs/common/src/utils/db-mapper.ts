export abstract class DatabaseMapper<DomainModel, DataModel> {
	abstract toDomain(dataModel: DataModel): DomainModel;
	abstract fromDomain(domainModel: DomainModel, config?: any): DataModel;
}
