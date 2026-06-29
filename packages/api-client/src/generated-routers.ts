/**
 * AUTO-GENERATED — do not edit manually.
 * Run: bun scripts/generate.ts
 *
 * 541 endpoints across 49 routers
 */
import type { operations } from "./generated.ts";
import type { ResponseMap } from "./response-map.ts";

type BodyOf<T> = T extends { requestBody: { content: { "application/json": infer B } } } ? B : never;
type QueryOf<T> = T extends { parameters: { query: infer Q } } ? Q : never;
type ResponseOf<OpId extends string> = OpId extends keyof ResponseMap ? ResponseMap[OpId] : unknown;

export interface Transport {
    query<T>(procedure: string, input?: object): Promise<T>;
    mutate<T>(procedure: string, input: object): Promise<T>;
}

export class AdminRouter {
    constructor(private transport: Transport) {
    }

    async setupMonitoring<T = ResponseOf<"admin-setupMonitoring">>(input: BodyOf<operations["admin-setupMonitoring"]>): Promise<T> {
        return this.transport.mutate<T>("admin.setupMonitoring", input);
    }
}

export class AiRouter {
    constructor(private transport: Transport) {
    }

    async one<T = ResponseOf<"ai-one">>(input: QueryOf<operations["ai-one"]>): Promise<T> {
        return this.transport.query<T>("ai.one", input);
    }

    async getModels<T = ResponseOf<"ai-getModels">>(input: QueryOf<operations["ai-getModels"]>): Promise<T> {
        return this.transport.query<T>("ai.getModels", input);
    }

    async create<T = ResponseOf<"ai-create">>(input: BodyOf<operations["ai-create"]>): Promise<T> {
        return this.transport.mutate<T>("ai.create", input);
    }

    async update<T = ResponseOf<"ai-update">>(input: BodyOf<operations["ai-update"]>): Promise<T> {
        return this.transport.mutate<T>("ai.update", input);
    }

    async getAll<T = ResponseOf<"ai-getAll">>(): Promise<T> {
        return this.transport.query<T>("ai.getAll");
    }

    async get<T = ResponseOf<"ai-get">>(input: QueryOf<operations["ai-get"]>): Promise<T> {
        return this.transport.query<T>("ai.get", input);
    }

    async delete<T = ResponseOf<"ai-delete">>(input: BodyOf<operations["ai-delete"]>): Promise<T> {
        return this.transport.mutate<T>("ai.delete", input);
    }

    async getEnabledProviders<T = ResponseOf<"ai-getEnabledProviders">>(): Promise<T> {
        return this.transport.query<T>("ai.getEnabledProviders");
    }

    async analyzeLogs<T = ResponseOf<"ai-analyzeLogs">>(input: BodyOf<operations["ai-analyzeLogs"]>): Promise<T> {
        return this.transport.mutate<T>("ai.analyzeLogs", input);
    }

    async testConnection<T = ResponseOf<"ai-testConnection">>(input: BodyOf<operations["ai-testConnection"]>): Promise<T> {
        return this.transport.mutate<T>("ai.testConnection", input);
    }

    async suggest<T = ResponseOf<"ai-suggest">>(input: BodyOf<operations["ai-suggest"]>): Promise<T> {
        return this.transport.mutate<T>("ai.suggest", input);
    }

    async deploy<T = ResponseOf<"ai-deploy">>(input: BodyOf<operations["ai-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("ai.deploy", input);
    }
}

export class ApplicationRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"application-create">>(input: BodyOf<operations["application-create"]>): Promise<T> {
        return this.transport.mutate<T>("application.create", input);
    }

    async one<T = ResponseOf<"application-one">>(input: QueryOf<operations["application-one"]>): Promise<T> {
        return this.transport.query<T>("application.one", input);
    }

    async reload<T = ResponseOf<"application-reload">>(input: BodyOf<operations["application-reload"]>): Promise<T> {
        return this.transport.mutate<T>("application.reload", input);
    }

    async delete<T = ResponseOf<"application-delete">>(input: BodyOf<operations["application-delete"]>): Promise<T> {
        return this.transport.mutate<T>("application.delete", input);
    }

    async stop<T = ResponseOf<"application-stop">>(input: BodyOf<operations["application-stop"]>): Promise<T> {
        return this.transport.mutate<T>("application.stop", input);
    }

    async start<T = ResponseOf<"application-start">>(input: BodyOf<operations["application-start"]>): Promise<T> {
        return this.transport.mutate<T>("application.start", input);
    }

    async redeploy<T = ResponseOf<"application-redeploy">>(input: BodyOf<operations["application-redeploy"]>): Promise<T> {
        return this.transport.mutate<T>("application.redeploy", input);
    }

    async saveEnvironment<T = ResponseOf<"application-saveEnvironment">>(input: BodyOf<operations["application-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveEnvironment", input);
    }

    async saveBuildType<T = ResponseOf<"application-saveBuildType">>(input: BodyOf<operations["application-saveBuildType"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveBuildType", input);
    }

    async saveGithubProvider<T = ResponseOf<"application-saveGithubProvider">>(input: BodyOf<operations["application-saveGithubProvider"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveGithubProvider", input);
    }

    async saveGitlabProvider<T = ResponseOf<"application-saveGitlabProvider">>(input: BodyOf<operations["application-saveGitlabProvider"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveGitlabProvider", input);
    }

    async saveBitbucketProvider<T = ResponseOf<"application-saveBitbucketProvider">>(input: BodyOf<operations["application-saveBitbucketProvider"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveBitbucketProvider", input);
    }

    async saveGiteaProvider<T = ResponseOf<"application-saveGiteaProvider">>(input: BodyOf<operations["application-saveGiteaProvider"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveGiteaProvider", input);
    }

    async saveDockerProvider<T = ResponseOf<"application-saveDockerProvider">>(input: BodyOf<operations["application-saveDockerProvider"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveDockerProvider", input);
    }

    async saveGitProvider<T = ResponseOf<"application-saveGitProvider">>(input: BodyOf<operations["application-saveGitProvider"]>): Promise<T> {
        return this.transport.mutate<T>("application.saveGitProvider", input);
    }

    async disconnectGitProvider<T = ResponseOf<"application-disconnectGitProvider">>(input: BodyOf<operations["application-disconnectGitProvider"]>): Promise<T> {
        return this.transport.mutate<T>("application.disconnectGitProvider", input);
    }

    async markRunning<T = ResponseOf<"application-markRunning">>(input: BodyOf<operations["application-markRunning"]>): Promise<T> {
        return this.transport.mutate<T>("application.markRunning", input);
    }

    async update<T = ResponseOf<"application-update">>(input: BodyOf<operations["application-update"]>): Promise<T> {
        return this.transport.mutate<T>("application.update", input);
    }

    async refreshToken<T = ResponseOf<"application-refreshToken">>(input: BodyOf<operations["application-refreshToken"]>): Promise<T> {
        return this.transport.mutate<T>("application.refreshToken", input);
    }

    async deploy<T = ResponseOf<"application-deploy">>(input: BodyOf<operations["application-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("application.deploy", input);
    }

    async cleanQueues<T = ResponseOf<"application-cleanQueues">>(input: BodyOf<operations["application-cleanQueues"]>): Promise<T> {
        return this.transport.mutate<T>("application.cleanQueues", input);
    }

    async clearDeployments<T = ResponseOf<"application-clearDeployments">>(input: BodyOf<operations["application-clearDeployments"]>): Promise<T> {
        return this.transport.mutate<T>("application.clearDeployments", input);
    }

    async killBuild<T = ResponseOf<"application-killBuild">>(input: BodyOf<operations["application-killBuild"]>): Promise<T> {
        return this.transport.mutate<T>("application.killBuild", input);
    }

    async readTraefikConfig<T = ResponseOf<"application-readTraefikConfig">>(input: QueryOf<operations["application-readTraefikConfig"]>): Promise<T> {
        return this.transport.query<T>("application.readTraefikConfig", input);
    }

    async dropDeployment<T = ResponseOf<"application-dropDeployment">>(input: BodyOf<operations["application-dropDeployment"]>): Promise<T> {
        return this.transport.mutate<T>("application.dropDeployment", input);
    }

    async updateTraefikConfig<T = ResponseOf<"application-updateTraefikConfig">>(input: BodyOf<operations["application-updateTraefikConfig"]>): Promise<T> {
        return this.transport.mutate<T>("application.updateTraefikConfig", input);
    }

    async readAppMonitoring<T = ResponseOf<"application-readAppMonitoring">>(input: QueryOf<operations["application-readAppMonitoring"]>): Promise<T> {
        return this.transport.query<T>("application.readAppMonitoring", input);
    }

    async move<T = ResponseOf<"application-move">>(input: BodyOf<operations["application-move"]>): Promise<T> {
        return this.transport.mutate<T>("application.move", input);
    }

    async cancelDeployment<T = ResponseOf<"application-cancelDeployment">>(input: BodyOf<operations["application-cancelDeployment"]>): Promise<T> {
        return this.transport.mutate<T>("application.cancelDeployment", input);
    }

    async search<T = ResponseOf<"application-search">>(input: QueryOf<operations["application-search"]>): Promise<T> {
        return this.transport.query<T>("application.search", input);
    }

    async readLogs<T = ResponseOf<"application-readLogs">>(input: QueryOf<operations["application-readLogs"]>): Promise<T> {
        return this.transport.query<T>("application.readLogs", input);
    }
}

export class AuditLogRouter {
    constructor(private transport: Transport) {
    }

    async all<T = ResponseOf<"auditLog-all">>(input: QueryOf<operations["auditLog-all"]>): Promise<T> {
        return this.transport.query<T>("auditLog.all", input);
    }
}

export class BackupRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"backup-create">>(input: BodyOf<operations["backup-create"]>): Promise<T> {
        return this.transport.mutate<T>("backup.create", input);
    }

    async one<T = ResponseOf<"backup-one">>(input: QueryOf<operations["backup-one"]>): Promise<T> {
        return this.transport.query<T>("backup.one", input);
    }

    async update<T = ResponseOf<"backup-update">>(input: BodyOf<operations["backup-update"]>): Promise<T> {
        return this.transport.mutate<T>("backup.update", input);
    }

    async remove<T = ResponseOf<"backup-remove">>(input: BodyOf<operations["backup-remove"]>): Promise<T> {
        return this.transport.mutate<T>("backup.remove", input);
    }

    async manualBackupPostgres<T = ResponseOf<"backup-manualBackupPostgres">>(input: BodyOf<operations["backup-manualBackupPostgres"]>): Promise<T> {
        return this.transport.mutate<T>("backup.manualBackupPostgres", input);
    }

    async manualBackupMySql<T = ResponseOf<"backup-manualBackupMySql">>(input: BodyOf<operations["backup-manualBackupMySql"]>): Promise<T> {
        return this.transport.mutate<T>("backup.manualBackupMySql", input);
    }

    async manualBackupMariadb<T = ResponseOf<"backup-manualBackupMariadb">>(input: BodyOf<operations["backup-manualBackupMariadb"]>): Promise<T> {
        return this.transport.mutate<T>("backup.manualBackupMariadb", input);
    }

    async manualBackupCompose<T = ResponseOf<"backup-manualBackupCompose">>(input: BodyOf<operations["backup-manualBackupCompose"]>): Promise<T> {
        return this.transport.mutate<T>("backup.manualBackupCompose", input);
    }

    async manualBackupMongo<T = ResponseOf<"backup-manualBackupMongo">>(input: BodyOf<operations["backup-manualBackupMongo"]>): Promise<T> {
        return this.transport.mutate<T>("backup.manualBackupMongo", input);
    }

    async manualBackupLibsql<T = ResponseOf<"backup-manualBackupLibsql">>(input: BodyOf<operations["backup-manualBackupLibsql"]>): Promise<T> {
        return this.transport.mutate<T>("backup.manualBackupLibsql", input);
    }

    async manualBackupWebServer<T = ResponseOf<"backup-manualBackupWebServer">>(input: BodyOf<operations["backup-manualBackupWebServer"]>): Promise<T> {
        return this.transport.mutate<T>("backup.manualBackupWebServer", input);
    }

    async listBackupFiles<T = ResponseOf<"backup-listBackupFiles">>(input: QueryOf<operations["backup-listBackupFiles"]>): Promise<T> {
        return this.transport.query<T>("backup.listBackupFiles", input);
    }
}

export class BitbucketRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"bitbucket-create">>(input: BodyOf<operations["bitbucket-create"]>): Promise<T> {
        return this.transport.mutate<T>("bitbucket.create", input);
    }

    async one<T = ResponseOf<"bitbucket-one">>(input: QueryOf<operations["bitbucket-one"]>): Promise<T> {
        return this.transport.query<T>("bitbucket.one", input);
    }

    async bitbucketProviders<T = ResponseOf<"bitbucket-bitbucketProviders">>(): Promise<T> {
        return this.transport.query<T>("bitbucket.bitbucketProviders");
    }

    async getBitbucketRepositories<T = ResponseOf<"bitbucket-getBitbucketRepositories">>(input: QueryOf<operations["bitbucket-getBitbucketRepositories"]>): Promise<T> {
        return this.transport.query<T>("bitbucket.getBitbucketRepositories", input);
    }

    async getBitbucketBranches<T = ResponseOf<"bitbucket-getBitbucketBranches">>(input: QueryOf<operations["bitbucket-getBitbucketBranches"]>): Promise<T> {
        return this.transport.query<T>("bitbucket.getBitbucketBranches", input);
    }

    async testConnection<T = ResponseOf<"bitbucket-testConnection">>(input: BodyOf<operations["bitbucket-testConnection"]>): Promise<T> {
        return this.transport.mutate<T>("bitbucket.testConnection", input);
    }

    async update<T = ResponseOf<"bitbucket-update">>(input: BodyOf<operations["bitbucket-update"]>): Promise<T> {
        return this.transport.mutate<T>("bitbucket.update", input);
    }
}

export class CertificatesRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"certificates-create">>(input: BodyOf<operations["certificates-create"]>): Promise<T> {
        return this.transport.mutate<T>("certificates.create", input);
    }

    async one<T = ResponseOf<"certificates-one">>(input: QueryOf<operations["certificates-one"]>): Promise<T> {
        return this.transport.query<T>("certificates.one", input);
    }

    async remove<T = ResponseOf<"certificates-remove">>(input: BodyOf<operations["certificates-remove"]>): Promise<T> {
        return this.transport.mutate<T>("certificates.remove", input);
    }

    async all<T = ResponseOf<"certificates-all">>(): Promise<T> {
        return this.transport.query<T>("certificates.all");
    }

    async update<T = ResponseOf<"certificates-update">>(input: BodyOf<operations["certificates-update"]>): Promise<T> {
        return this.transport.mutate<T>("certificates.update", input);
    }
}

export class ClusterRouter {
    constructor(private transport: Transport) {
    }

    async getNodes<T = ResponseOf<"cluster-getNodes">>(input: QueryOf<operations["cluster-getNodes"]>): Promise<T> {
        return this.transport.query<T>("cluster.getNodes", input);
    }

    async removeWorker<T = ResponseOf<"cluster-removeWorker">>(input: BodyOf<operations["cluster-removeWorker"]>): Promise<T> {
        return this.transport.mutate<T>("cluster.removeWorker", input);
    }

    async addWorker<T = ResponseOf<"cluster-addWorker">>(input: QueryOf<operations["cluster-addWorker"]>): Promise<T> {
        return this.transport.query<T>("cluster.addWorker", input);
    }

    async addManager<T = ResponseOf<"cluster-addManager">>(input: QueryOf<operations["cluster-addManager"]>): Promise<T> {
        return this.transport.query<T>("cluster.addManager", input);
    }
}

export class ComposeRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"compose-create">>(input: BodyOf<operations["compose-create"]>): Promise<T> {
        return this.transport.mutate<T>("compose.create", input);
    }

    async one<T = ResponseOf<"compose-one">>(input: QueryOf<operations["compose-one"]>): Promise<T> {
        return this.transport.query<T>("compose.one", input);
    }

    async update<T = ResponseOf<"compose-update">>(input: BodyOf<operations["compose-update"]>): Promise<T> {
        return this.transport.mutate<T>("compose.update", input);
    }

    async saveEnvironment<T = ResponseOf<"compose-saveEnvironment">>(input: BodyOf<operations["compose-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("compose.saveEnvironment", input);
    }

    async delete<T = ResponseOf<"compose-delete">>(input: BodyOf<operations["compose-delete"]>): Promise<T> {
        return this.transport.mutate<T>("compose.delete", input);
    }

    async cleanQueues<T = ResponseOf<"compose-cleanQueues">>(input: BodyOf<operations["compose-cleanQueues"]>): Promise<T> {
        return this.transport.mutate<T>("compose.cleanQueues", input);
    }

    async clearDeployments<T = ResponseOf<"compose-clearDeployments">>(input: BodyOf<operations["compose-clearDeployments"]>): Promise<T> {
        return this.transport.mutate<T>("compose.clearDeployments", input);
    }

    async killBuild<T = ResponseOf<"compose-killBuild">>(input: BodyOf<operations["compose-killBuild"]>): Promise<T> {
        return this.transport.mutate<T>("compose.killBuild", input);
    }

    async loadServices<T = ResponseOf<"compose-loadServices">>(input: QueryOf<operations["compose-loadServices"]>): Promise<T> {
        return this.transport.query<T>("compose.loadServices", input);
    }

    async loadMountsByService<T = ResponseOf<"compose-loadMountsByService">>(input: QueryOf<operations["compose-loadMountsByService"]>): Promise<T> {
        return this.transport.query<T>("compose.loadMountsByService", input);
    }

    async fetchSourceType<T = ResponseOf<"compose-fetchSourceType">>(input: BodyOf<operations["compose-fetchSourceType"]>): Promise<T> {
        return this.transport.mutate<T>("compose.fetchSourceType", input);
    }

    async randomizeCompose<T = ResponseOf<"compose-randomizeCompose">>(input: BodyOf<operations["compose-randomizeCompose"]>): Promise<T> {
        return this.transport.mutate<T>("compose.randomizeCompose", input);
    }

    async isolatedDeployment<T = ResponseOf<"compose-isolatedDeployment">>(input: BodyOf<operations["compose-isolatedDeployment"]>): Promise<T> {
        return this.transport.mutate<T>("compose.isolatedDeployment", input);
    }

    async getConvertedCompose<T = ResponseOf<"compose-getConvertedCompose">>(input: QueryOf<operations["compose-getConvertedCompose"]>): Promise<T> {
        return this.transport.query<T>("compose.getConvertedCompose", input);
    }

    async deploy<T = ResponseOf<"compose-deploy">>(input: BodyOf<operations["compose-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("compose.deploy", input);
    }

    async redeploy<T = ResponseOf<"compose-redeploy">>(input: BodyOf<operations["compose-redeploy"]>): Promise<T> {
        return this.transport.mutate<T>("compose.redeploy", input);
    }

    async stop<T = ResponseOf<"compose-stop">>(input: BodyOf<operations["compose-stop"]>): Promise<T> {
        return this.transport.mutate<T>("compose.stop", input);
    }

    async start<T = ResponseOf<"compose-start">>(input: BodyOf<operations["compose-start"]>): Promise<T> {
        return this.transport.mutate<T>("compose.start", input);
    }

    async getDefaultCommand<T = ResponseOf<"compose-getDefaultCommand">>(input: QueryOf<operations["compose-getDefaultCommand"]>): Promise<T> {
        return this.transport.query<T>("compose.getDefaultCommand", input);
    }

    async refreshToken<T = ResponseOf<"compose-refreshToken">>(input: BodyOf<operations["compose-refreshToken"]>): Promise<T> {
        return this.transport.mutate<T>("compose.refreshToken", input);
    }

    async deployTemplate<T = ResponseOf<"compose-deployTemplate">>(input: BodyOf<operations["compose-deployTemplate"]>): Promise<T> {
        return this.transport.mutate<T>("compose.deployTemplate", input);
    }

    async templates<T = ResponseOf<"compose-templates">>(input: QueryOf<operations["compose-templates"]>): Promise<T> {
        return this.transport.query<T>("compose.templates", input);
    }

    async getTags<T = ResponseOf<"compose-getTags">>(input: QueryOf<operations["compose-getTags"]>): Promise<T> {
        return this.transport.query<T>("compose.getTags", input);
    }

    async disconnectGitProvider<T = ResponseOf<"compose-disconnectGitProvider">>(input: BodyOf<operations["compose-disconnectGitProvider"]>): Promise<T> {
        return this.transport.mutate<T>("compose.disconnectGitProvider", input);
    }

    async move<T = ResponseOf<"compose-move">>(input: BodyOf<operations["compose-move"]>): Promise<T> {
        return this.transport.mutate<T>("compose.move", input);
    }

    async processTemplate<T = ResponseOf<"compose-processTemplate">>(input: BodyOf<operations["compose-processTemplate"]>): Promise<T> {
        return this.transport.mutate<T>("compose.processTemplate", input);
    }

    async previewTemplate<T = ResponseOf<"compose-previewTemplate">>(input: BodyOf<operations["compose-previewTemplate"]>): Promise<T> {
        return this.transport.mutate<T>("compose.previewTemplate", input);
    }

    async import<T = ResponseOf<"compose-import">>(input: BodyOf<operations["compose-import"]>): Promise<T> {
        return this.transport.mutate<T>("compose.import", input);
    }

    async cancelDeployment<T = ResponseOf<"compose-cancelDeployment">>(input: BodyOf<operations["compose-cancelDeployment"]>): Promise<T> {
        return this.transport.mutate<T>("compose.cancelDeployment", input);
    }

    async search<T = ResponseOf<"compose-search">>(input: QueryOf<operations["compose-search"]>): Promise<T> {
        return this.transport.query<T>("compose.search", input);
    }

    async readLogs<T = ResponseOf<"compose-readLogs">>(input: QueryOf<operations["compose-readLogs"]>): Promise<T> {
        return this.transport.query<T>("compose.readLogs", input);
    }
}

export class CustomRoleRouter {
    constructor(private transport: Transport) {
    }

    async all<T = ResponseOf<"customRole-all">>(): Promise<T> {
        return this.transport.query<T>("customRole.all");
    }

    async create<T = ResponseOf<"customRole-create">>(input: BodyOf<operations["customRole-create"]>): Promise<T> {
        return this.transport.mutate<T>("customRole.create", input);
    }

    async update<T = ResponseOf<"customRole-update">>(input: BodyOf<operations["customRole-update"]>): Promise<T> {
        return this.transport.mutate<T>("customRole.update", input);
    }

    async remove<T = ResponseOf<"customRole-remove">>(input: BodyOf<operations["customRole-remove"]>): Promise<T> {
        return this.transport.mutate<T>("customRole.remove", input);
    }

    async membersByRole<T = ResponseOf<"customRole-membersByRole">>(input: QueryOf<operations["customRole-membersByRole"]>): Promise<T> {
        return this.transport.query<T>("customRole.membersByRole", input);
    }

    async getStatements<T = ResponseOf<"customRole-getStatements">>(): Promise<T> {
        return this.transport.query<T>("customRole.getStatements");
    }
}

export class DeploymentRouter {
    constructor(private transport: Transport) {
    }

    async all<T = ResponseOf<"deployment-all">>(input: QueryOf<operations["deployment-all"]>): Promise<T> {
        return this.transport.query<T>("deployment.all", input);
    }

    async allByCompose<T = ResponseOf<"deployment-allByCompose">>(input: QueryOf<operations["deployment-allByCompose"]>): Promise<T> {
        return this.transport.query<T>("deployment.allByCompose", input);
    }

    async allByServer<T = ResponseOf<"deployment-allByServer">>(input: QueryOf<operations["deployment-allByServer"]>): Promise<T> {
        return this.transport.query<T>("deployment.allByServer", input);
    }

    async allCentralized<T = ResponseOf<"deployment-allCentralized">>(): Promise<T> {
        return this.transport.query<T>("deployment.allCentralized");
    }

    async queueList<T = ResponseOf<"deployment-queueList">>(): Promise<T> {
        return this.transport.query<T>("deployment.queueList");
    }

    async allByType<T = ResponseOf<"deployment-allByType">>(input: QueryOf<operations["deployment-allByType"]>): Promise<T> {
        return this.transport.query<T>("deployment.allByType", input);
    }

    async killProcess<T = ResponseOf<"deployment-killProcess">>(input: BodyOf<operations["deployment-killProcess"]>): Promise<T> {
        return this.transport.mutate<T>("deployment.killProcess", input);
    }

    async removeDeployment<T = ResponseOf<"deployment-removeDeployment">>(input: BodyOf<operations["deployment-removeDeployment"]>): Promise<T> {
        return this.transport.mutate<T>("deployment.removeDeployment", input);
    }

    async readLogs<T = ResponseOf<"deployment-readLogs">>(input: QueryOf<operations["deployment-readLogs"]>): Promise<T> {
        return this.transport.query<T>("deployment.readLogs", input);
    }
}

export class DestinationRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"destination-create">>(input: BodyOf<operations["destination-create"]>): Promise<T> {
        return this.transport.mutate<T>("destination.create", input);
    }

    async testConnection<T = ResponseOf<"destination-testConnection">>(input: BodyOf<operations["destination-testConnection"]>): Promise<T> {
        return this.transport.mutate<T>("destination.testConnection", input);
    }

    async one<T = ResponseOf<"destination-one">>(input: QueryOf<operations["destination-one"]>): Promise<T> {
        return this.transport.query<T>("destination.one", input);
    }

    async all<T = ResponseOf<"destination-all">>(): Promise<T> {
        return this.transport.query<T>("destination.all");
    }

    async remove<T = ResponseOf<"destination-remove">>(input: BodyOf<operations["destination-remove"]>): Promise<T> {
        return this.transport.mutate<T>("destination.remove", input);
    }

    async update<T = ResponseOf<"destination-update">>(input: BodyOf<operations["destination-update"]>): Promise<T> {
        return this.transport.mutate<T>("destination.update", input);
    }
}

export class DockerRouter {
    constructor(private transport: Transport) {
    }

    async getContainers<T = ResponseOf<"docker-getContainers">>(input: QueryOf<operations["docker-getContainers"]>): Promise<T> {
        return this.transport.query<T>("docker.getContainers", input);
    }

    async restartContainer<T = ResponseOf<"docker-restartContainer">>(input: BodyOf<operations["docker-restartContainer"]>): Promise<T> {
        return this.transport.mutate<T>("docker.restartContainer", input);
    }

    async startContainer<T = ResponseOf<"docker-startContainer">>(input: BodyOf<operations["docker-startContainer"]>): Promise<T> {
        return this.transport.mutate<T>("docker.startContainer", input);
    }

    async stopContainer<T = ResponseOf<"docker-stopContainer">>(input: BodyOf<operations["docker-stopContainer"]>): Promise<T> {
        return this.transport.mutate<T>("docker.stopContainer", input);
    }

    async killContainer<T = ResponseOf<"docker-killContainer">>(input: BodyOf<operations["docker-killContainer"]>): Promise<T> {
        return this.transport.mutate<T>("docker.killContainer", input);
    }

    async removeContainer<T = ResponseOf<"docker-removeContainer">>(input: BodyOf<operations["docker-removeContainer"]>): Promise<T> {
        return this.transport.mutate<T>("docker.removeContainer", input);
    }

    async getConfig<T = ResponseOf<"docker-getConfig">>(input: QueryOf<operations["docker-getConfig"]>): Promise<T> {
        return this.transport.query<T>("docker.getConfig", input);
    }

    async getContainersByAppNameMatch<T = ResponseOf<"docker-getContainersByAppNameMatch">>(input: QueryOf<operations["docker-getContainersByAppNameMatch"]>): Promise<T> {
        return this.transport.query<T>("docker.getContainersByAppNameMatch", input);
    }

    async getContainersByAppLabel<T = ResponseOf<"docker-getContainersByAppLabel">>(input: QueryOf<operations["docker-getContainersByAppLabel"]>): Promise<T> {
        return this.transport.query<T>("docker.getContainersByAppLabel", input);
    }

    async getStackContainersByAppName<T = ResponseOf<"docker-getStackContainersByAppName">>(input: QueryOf<operations["docker-getStackContainersByAppName"]>): Promise<T> {
        return this.transport.query<T>("docker.getStackContainersByAppName", input);
    }

    async getServiceContainersByAppName<T = ResponseOf<"docker-getServiceContainersByAppName">>(input: QueryOf<operations["docker-getServiceContainersByAppName"]>): Promise<T> {
        return this.transport.query<T>("docker.getServiceContainersByAppName", input);
    }

    async uploadFileToContainer<T = ResponseOf<"docker-uploadFileToContainer">>(input: BodyOf<operations["docker-uploadFileToContainer"]>): Promise<T> {
        return this.transport.mutate<T>("docker.uploadFileToContainer", input);
    }
}

export class DomainRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"domain-create">>(input: BodyOf<operations["domain-create"]>): Promise<T> {
        return this.transport.mutate<T>("domain.create", input);
    }

    async byApplicationId<T = ResponseOf<"domain-byApplicationId">>(input: QueryOf<operations["domain-byApplicationId"]>): Promise<T> {
        return this.transport.query<T>("domain.byApplicationId", input);
    }

    async byComposeId<T = ResponseOf<"domain-byComposeId">>(input: QueryOf<operations["domain-byComposeId"]>): Promise<T> {
        return this.transport.query<T>("domain.byComposeId", input);
    }

    async generateDomain<T = ResponseOf<"domain-generateDomain">>(input: BodyOf<operations["domain-generateDomain"]>): Promise<T> {
        return this.transport.mutate<T>("domain.generateDomain", input);
    }

    async canGenerateTraefikMeDomains<T = ResponseOf<"domain-canGenerateTraefikMeDomains">>(input: QueryOf<operations["domain-canGenerateTraefikMeDomains"]>): Promise<T> {
        return this.transport.query<T>("domain.canGenerateTraefikMeDomains", input);
    }

    async update<T = ResponseOf<"domain-update">>(input: BodyOf<operations["domain-update"]>): Promise<T> {
        return this.transport.mutate<T>("domain.update", input);
    }

    async one<T = ResponseOf<"domain-one">>(input: QueryOf<operations["domain-one"]>): Promise<T> {
        return this.transport.query<T>("domain.one", input);
    }

    async delete<T = ResponseOf<"domain-delete">>(input: BodyOf<operations["domain-delete"]>): Promise<T> {
        return this.transport.mutate<T>("domain.delete", input);
    }

    async validateDomain<T = ResponseOf<"domain-validateDomain">>(input: BodyOf<operations["domain-validateDomain"]>): Promise<T> {
        return this.transport.mutate<T>("domain.validateDomain", input);
    }
}

export class EnvironmentRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"environment-create">>(input: BodyOf<operations["environment-create"]>): Promise<T> {
        return this.transport.mutate<T>("environment.create", input);
    }

    async one<T = ResponseOf<"environment-one">>(input: QueryOf<operations["environment-one"]>): Promise<T> {
        return this.transport.query<T>("environment.one", input);
    }

    async byProjectId<T = ResponseOf<"environment-byProjectId">>(input: QueryOf<operations["environment-byProjectId"]>): Promise<T> {
        return this.transport.query<T>("environment.byProjectId", input);
    }

    async remove<T = ResponseOf<"environment-remove">>(input: BodyOf<operations["environment-remove"]>): Promise<T> {
        return this.transport.mutate<T>("environment.remove", input);
    }

    async update<T = ResponseOf<"environment-update">>(input: BodyOf<operations["environment-update"]>): Promise<T> {
        return this.transport.mutate<T>("environment.update", input);
    }

    async duplicate<T = ResponseOf<"environment-duplicate">>(input: BodyOf<operations["environment-duplicate"]>): Promise<T> {
        return this.transport.mutate<T>("environment.duplicate", input);
    }

    async search<T = ResponseOf<"environment-search">>(input: QueryOf<operations["environment-search"]>): Promise<T> {
        return this.transport.query<T>("environment.search", input);
    }
}

export class ForwardAuthRouter {
    constructor(private transport: Transport) {
    }

    async getAuthDomain<T = ResponseOf<"forwardAuth-getAuthDomain">>(input: QueryOf<operations["forwardAuth-getAuthDomain"]>): Promise<T> {
        return this.transport.query<T>("forwardAuth.getAuthDomain", input);
    }

    async setAuthDomain<T = ResponseOf<"forwardAuth-setAuthDomain">>(input: BodyOf<operations["forwardAuth-setAuthDomain"]>): Promise<T> {
        return this.transport.mutate<T>("forwardAuth.setAuthDomain", input);
    }

    async removeAuthDomain<T = ResponseOf<"forwardAuth-removeAuthDomain">>(input: BodyOf<operations["forwardAuth-removeAuthDomain"]>): Promise<T> {
        return this.transport.mutate<T>("forwardAuth.removeAuthDomain", input);
    }

    async listProviders<T = ResponseOf<"forwardAuth-listProviders">>(): Promise<T> {
        return this.transport.query<T>("forwardAuth.listProviders");
    }

    async serverStatus<T = ResponseOf<"forwardAuth-serverStatus">>(): Promise<T> {
        return this.transport.query<T>("forwardAuth.serverStatus");
    }

    async deployOnServer<T = ResponseOf<"forwardAuth-deployOnServer">>(input: BodyOf<operations["forwardAuth-deployOnServer"]>): Promise<T> {
        return this.transport.mutate<T>("forwardAuth.deployOnServer", input);
    }

    async removeOnServer<T = ResponseOf<"forwardAuth-removeOnServer">>(input: BodyOf<operations["forwardAuth-removeOnServer"]>): Promise<T> {
        return this.transport.mutate<T>("forwardAuth.removeOnServer", input);
    }

    async status<T = ResponseOf<"forwardAuth-status">>(input: QueryOf<operations["forwardAuth-status"]>): Promise<T> {
        return this.transport.query<T>("forwardAuth.status", input);
    }

    async enable<T = ResponseOf<"forwardAuth-enable">>(input: BodyOf<operations["forwardAuth-enable"]>): Promise<T> {
        return this.transport.mutate<T>("forwardAuth.enable", input);
    }

    async disable<T = ResponseOf<"forwardAuth-disable">>(input: BodyOf<operations["forwardAuth-disable"]>): Promise<T> {
        return this.transport.mutate<T>("forwardAuth.disable", input);
    }
}

export class GiteaRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"gitea-create">>(input: BodyOf<operations["gitea-create"]>): Promise<T> {
        return this.transport.mutate<T>("gitea.create", input);
    }

    async one<T = ResponseOf<"gitea-one">>(input: QueryOf<operations["gitea-one"]>): Promise<T> {
        return this.transport.query<T>("gitea.one", input);
    }

    async giteaProviders<T = ResponseOf<"gitea-giteaProviders">>(): Promise<T> {
        return this.transport.query<T>("gitea.giteaProviders");
    }

    async getGiteaRepositories<T = ResponseOf<"gitea-getGiteaRepositories">>(input: QueryOf<operations["gitea-getGiteaRepositories"]>): Promise<T> {
        return this.transport.query<T>("gitea.getGiteaRepositories", input);
    }

    async getGiteaBranches<T = ResponseOf<"gitea-getGiteaBranches">>(input: QueryOf<operations["gitea-getGiteaBranches"]>): Promise<T> {
        return this.transport.query<T>("gitea.getGiteaBranches", input);
    }

    async testConnection<T = ResponseOf<"gitea-testConnection">>(input: BodyOf<operations["gitea-testConnection"]>): Promise<T> {
        return this.transport.mutate<T>("gitea.testConnection", input);
    }

    async update<T = ResponseOf<"gitea-update">>(input: BodyOf<operations["gitea-update"]>): Promise<T> {
        return this.transport.mutate<T>("gitea.update", input);
    }

    async getGiteaUrl<T = ResponseOf<"gitea-getGiteaUrl">>(input: QueryOf<operations["gitea-getGiteaUrl"]>): Promise<T> {
        return this.transport.query<T>("gitea.getGiteaUrl", input);
    }
}

export class GithubRouter {
    constructor(private transport: Transport) {
    }

    async one<T = ResponseOf<"github-one">>(input: QueryOf<operations["github-one"]>): Promise<T> {
        return this.transport.query<T>("github.one", input);
    }

    async getGithubRepositories<T = ResponseOf<"github-getGithubRepositories">>(input: QueryOf<operations["github-getGithubRepositories"]>): Promise<T> {
        return this.transport.query<T>("github.getGithubRepositories", input);
    }

    async getGithubBranches<T = ResponseOf<"github-getGithubBranches">>(input: QueryOf<operations["github-getGithubBranches"]>): Promise<T> {
        return this.transport.query<T>("github.getGithubBranches", input);
    }

    async githubProviders<T = ResponseOf<"github-githubProviders">>(): Promise<T> {
        return this.transport.query<T>("github.githubProviders");
    }

    async testConnection<T = ResponseOf<"github-testConnection">>(input: BodyOf<operations["github-testConnection"]>): Promise<T> {
        return this.transport.mutate<T>("github.testConnection", input);
    }

    async update<T = ResponseOf<"github-update">>(input: BodyOf<operations["github-update"]>): Promise<T> {
        return this.transport.mutate<T>("github.update", input);
    }
}

export class GitlabRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"gitlab-create">>(input: BodyOf<operations["gitlab-create"]>): Promise<T> {
        return this.transport.mutate<T>("gitlab.create", input);
    }

    async one<T = ResponseOf<"gitlab-one">>(input: QueryOf<operations["gitlab-one"]>): Promise<T> {
        return this.transport.query<T>("gitlab.one", input);
    }

    async gitlabProviders<T = ResponseOf<"gitlab-gitlabProviders">>(): Promise<T> {
        return this.transport.query<T>("gitlab.gitlabProviders");
    }

    async getGitlabRepositories<T = ResponseOf<"gitlab-getGitlabRepositories">>(input: QueryOf<operations["gitlab-getGitlabRepositories"]>): Promise<T> {
        return this.transport.query<T>("gitlab.getGitlabRepositories", input);
    }

    async getGitlabBranches<T = ResponseOf<"gitlab-getGitlabBranches">>(input: QueryOf<operations["gitlab-getGitlabBranches"]>): Promise<T> {
        return this.transport.query<T>("gitlab.getGitlabBranches", input);
    }

    async testConnection<T = ResponseOf<"gitlab-testConnection">>(input: BodyOf<operations["gitlab-testConnection"]>): Promise<T> {
        return this.transport.mutate<T>("gitlab.testConnection", input);
    }

    async update<T = ResponseOf<"gitlab-update">>(input: BodyOf<operations["gitlab-update"]>): Promise<T> {
        return this.transport.mutate<T>("gitlab.update", input);
    }
}

export class GitProviderRouter {
    constructor(private transport: Transport) {
    }

    async getAll<T = ResponseOf<"gitProvider-getAll">>(): Promise<T> {
        return this.transport.query<T>("gitProvider.getAll");
    }

    async toggleShare<T = ResponseOf<"gitProvider-toggleShare">>(input: BodyOf<operations["gitProvider-toggleShare"]>): Promise<T> {
        return this.transport.mutate<T>("gitProvider.toggleShare", input);
    }

    async allForPermissions<T = ResponseOf<"gitProvider-allForPermissions">>(): Promise<T> {
        return this.transport.query<T>("gitProvider.allForPermissions");
    }

    async remove<T = ResponseOf<"gitProvider-remove">>(input: BodyOf<operations["gitProvider-remove"]>): Promise<T> {
        return this.transport.mutate<T>("gitProvider.remove", input);
    }
}

export class LibsqlRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"libsql-create">>(input: BodyOf<operations["libsql-create"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.create", input);
    }

    async one<T = ResponseOf<"libsql-one">>(input: QueryOf<operations["libsql-one"]>): Promise<T> {
        return this.transport.query<T>("libsql.one", input);
    }

    async start<T = ResponseOf<"libsql-start">>(input: BodyOf<operations["libsql-start"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.start", input);
    }

    async stop<T = ResponseOf<"libsql-stop">>(input: BodyOf<operations["libsql-stop"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.stop", input);
    }

    async saveExternalPorts<T = ResponseOf<"libsql-saveExternalPorts">>(input: BodyOf<operations["libsql-saveExternalPorts"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.saveExternalPorts", input);
    }

    async deploy<T = ResponseOf<"libsql-deploy">>(input: BodyOf<operations["libsql-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.deploy", input);
    }

    async changeStatus<T = ResponseOf<"libsql-changeStatus">>(input: BodyOf<operations["libsql-changeStatus"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.changeStatus", input);
    }

    async remove<T = ResponseOf<"libsql-remove">>(input: BodyOf<operations["libsql-remove"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.remove", input);
    }

    async saveEnvironment<T = ResponseOf<"libsql-saveEnvironment">>(input: BodyOf<operations["libsql-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.saveEnvironment", input);
    }

    async reload<T = ResponseOf<"libsql-reload">>(input: BodyOf<operations["libsql-reload"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.reload", input);
    }

    async update<T = ResponseOf<"libsql-update">>(input: BodyOf<operations["libsql-update"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.update", input);
    }

    async move<T = ResponseOf<"libsql-move">>(input: BodyOf<operations["libsql-move"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.move", input);
    }

    async rebuild<T = ResponseOf<"libsql-rebuild">>(input: BodyOf<operations["libsql-rebuild"]>): Promise<T> {
        return this.transport.mutate<T>("libsql.rebuild", input);
    }

    async readLogs<T = ResponseOf<"libsql-readLogs">>(input: QueryOf<operations["libsql-readLogs"]>): Promise<T> {
        return this.transport.query<T>("libsql.readLogs", input);
    }
}

export class LicenseKeyRouter {
    constructor(private transport: Transport) {
    }

    async activate<T = ResponseOf<"licenseKey-activate">>(input: BodyOf<operations["licenseKey-activate"]>): Promise<T> {
        return this.transport.mutate<T>("licenseKey.activate", input);
    }

    async validate<T = ResponseOf<"licenseKey-validate">>(): Promise<T> {
        return this.transport.mutate<T>("licenseKey.validate", {});
    }

    async deactivate<T = ResponseOf<"licenseKey-deactivate">>(): Promise<T> {
        return this.transport.mutate<T>("licenseKey.deactivate", {});
    }

    async getEnterpriseSettings<T = ResponseOf<"licenseKey-getEnterpriseSettings">>(): Promise<T> {
        return this.transport.query<T>("licenseKey.getEnterpriseSettings");
    }

    async haveValidLicenseKey<T = ResponseOf<"licenseKey-haveValidLicenseKey">>(): Promise<T> {
        return this.transport.query<T>("licenseKey.haveValidLicenseKey");
    }

    async updateEnterpriseSettings<T = ResponseOf<"licenseKey-updateEnterpriseSettings">>(input: BodyOf<operations["licenseKey-updateEnterpriseSettings"]>): Promise<T> {
        return this.transport.mutate<T>("licenseKey.updateEnterpriseSettings", input);
    }
}

export class MariadbRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"mariadb-create">>(input: BodyOf<operations["mariadb-create"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.create", input);
    }

    async one<T = ResponseOf<"mariadb-one">>(input: QueryOf<operations["mariadb-one"]>): Promise<T> {
        return this.transport.query<T>("mariadb.one", input);
    }

    async start<T = ResponseOf<"mariadb-start">>(input: BodyOf<operations["mariadb-start"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.start", input);
    }

    async stop<T = ResponseOf<"mariadb-stop">>(input: BodyOf<operations["mariadb-stop"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.stop", input);
    }

    async saveExternalPort<T = ResponseOf<"mariadb-saveExternalPort">>(input: BodyOf<operations["mariadb-saveExternalPort"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.saveExternalPort", input);
    }

    async deploy<T = ResponseOf<"mariadb-deploy">>(input: BodyOf<operations["mariadb-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.deploy", input);
    }

    async changeStatus<T = ResponseOf<"mariadb-changeStatus">>(input: BodyOf<operations["mariadb-changeStatus"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.changeStatus", input);
    }

    async remove<T = ResponseOf<"mariadb-remove">>(input: BodyOf<operations["mariadb-remove"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.remove", input);
    }

    async saveEnvironment<T = ResponseOf<"mariadb-saveEnvironment">>(input: BodyOf<operations["mariadb-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.saveEnvironment", input);
    }

    async reload<T = ResponseOf<"mariadb-reload">>(input: BodyOf<operations["mariadb-reload"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.reload", input);
    }

    async update<T = ResponseOf<"mariadb-update">>(input: BodyOf<operations["mariadb-update"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.update", input);
    }

    async changePassword<T = ResponseOf<"mariadb-changePassword">>(input: BodyOf<operations["mariadb-changePassword"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.changePassword", input);
    }

    async move<T = ResponseOf<"mariadb-move">>(input: BodyOf<operations["mariadb-move"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.move", input);
    }

    async rebuild<T = ResponseOf<"mariadb-rebuild">>(input: BodyOf<operations["mariadb-rebuild"]>): Promise<T> {
        return this.transport.mutate<T>("mariadb.rebuild", input);
    }

    async search<T = ResponseOf<"mariadb-search">>(input: QueryOf<operations["mariadb-search"]>): Promise<T> {
        return this.transport.query<T>("mariadb.search", input);
    }

    async readLogs<T = ResponseOf<"mariadb-readLogs">>(input: QueryOf<operations["mariadb-readLogs"]>): Promise<T> {
        return this.transport.query<T>("mariadb.readLogs", input);
    }
}

export class MongoRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"mongo-create">>(input: BodyOf<operations["mongo-create"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.create", input);
    }

    async one<T = ResponseOf<"mongo-one">>(input: QueryOf<operations["mongo-one"]>): Promise<T> {
        return this.transport.query<T>("mongo.one", input);
    }

    async start<T = ResponseOf<"mongo-start">>(input: BodyOf<operations["mongo-start"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.start", input);
    }

    async stop<T = ResponseOf<"mongo-stop">>(input: BodyOf<operations["mongo-stop"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.stop", input);
    }

    async saveExternalPort<T = ResponseOf<"mongo-saveExternalPort">>(input: BodyOf<operations["mongo-saveExternalPort"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.saveExternalPort", input);
    }

    async deploy<T = ResponseOf<"mongo-deploy">>(input: BodyOf<operations["mongo-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.deploy", input);
    }

    async changeStatus<T = ResponseOf<"mongo-changeStatus">>(input: BodyOf<operations["mongo-changeStatus"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.changeStatus", input);
    }

    async reload<T = ResponseOf<"mongo-reload">>(input: BodyOf<operations["mongo-reload"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.reload", input);
    }

    async remove<T = ResponseOf<"mongo-remove">>(input: BodyOf<operations["mongo-remove"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.remove", input);
    }

    async saveEnvironment<T = ResponseOf<"mongo-saveEnvironment">>(input: BodyOf<operations["mongo-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.saveEnvironment", input);
    }

    async update<T = ResponseOf<"mongo-update">>(input: BodyOf<operations["mongo-update"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.update", input);
    }

    async changePassword<T = ResponseOf<"mongo-changePassword">>(input: BodyOf<operations["mongo-changePassword"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.changePassword", input);
    }

    async move<T = ResponseOf<"mongo-move">>(input: BodyOf<operations["mongo-move"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.move", input);
    }

    async rebuild<T = ResponseOf<"mongo-rebuild">>(input: BodyOf<operations["mongo-rebuild"]>): Promise<T> {
        return this.transport.mutate<T>("mongo.rebuild", input);
    }

    async search<T = ResponseOf<"mongo-search">>(input: QueryOf<operations["mongo-search"]>): Promise<T> {
        return this.transport.query<T>("mongo.search", input);
    }

    async readLogs<T = ResponseOf<"mongo-readLogs">>(input: QueryOf<operations["mongo-readLogs"]>): Promise<T> {
        return this.transport.query<T>("mongo.readLogs", input);
    }
}

export class MountsRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"mounts-create">>(input: BodyOf<operations["mounts-create"]>): Promise<T> {
        return this.transport.mutate<T>("mounts.create", input);
    }

    async remove<T = ResponseOf<"mounts-remove">>(input: BodyOf<operations["mounts-remove"]>): Promise<T> {
        return this.transport.mutate<T>("mounts.remove", input);
    }

    async one<T = ResponseOf<"mounts-one">>(input: QueryOf<operations["mounts-one"]>): Promise<T> {
        return this.transport.query<T>("mounts.one", input);
    }

    async update<T = ResponseOf<"mounts-update">>(input: BodyOf<operations["mounts-update"]>): Promise<T> {
        return this.transport.mutate<T>("mounts.update", input);
    }

    async allNamedByApplicationId<T = ResponseOf<"mounts-allNamedByApplicationId">>(input: QueryOf<operations["mounts-allNamedByApplicationId"]>): Promise<T> {
        return this.transport.query<T>("mounts.allNamedByApplicationId", input);
    }

    async listByServiceId<T = ResponseOf<"mounts-listByServiceId">>(input: QueryOf<operations["mounts-listByServiceId"]>): Promise<T> {
        return this.transport.query<T>("mounts.listByServiceId", input);
    }
}

export class MysqlRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"mysql-create">>(input: BodyOf<operations["mysql-create"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.create", input);
    }

    async one<T = ResponseOf<"mysql-one">>(input: QueryOf<operations["mysql-one"]>): Promise<T> {
        return this.transport.query<T>("mysql.one", input);
    }

    async start<T = ResponseOf<"mysql-start">>(input: BodyOf<operations["mysql-start"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.start", input);
    }

    async stop<T = ResponseOf<"mysql-stop">>(input: BodyOf<operations["mysql-stop"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.stop", input);
    }

    async saveExternalPort<T = ResponseOf<"mysql-saveExternalPort">>(input: BodyOf<operations["mysql-saveExternalPort"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.saveExternalPort", input);
    }

    async deploy<T = ResponseOf<"mysql-deploy">>(input: BodyOf<operations["mysql-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.deploy", input);
    }

    async changeStatus<T = ResponseOf<"mysql-changeStatus">>(input: BodyOf<operations["mysql-changeStatus"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.changeStatus", input);
    }

    async reload<T = ResponseOf<"mysql-reload">>(input: BodyOf<operations["mysql-reload"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.reload", input);
    }

    async remove<T = ResponseOf<"mysql-remove">>(input: BodyOf<operations["mysql-remove"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.remove", input);
    }

    async saveEnvironment<T = ResponseOf<"mysql-saveEnvironment">>(input: BodyOf<operations["mysql-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.saveEnvironment", input);
    }

    async update<T = ResponseOf<"mysql-update">>(input: BodyOf<operations["mysql-update"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.update", input);
    }

    async changePassword<T = ResponseOf<"mysql-changePassword">>(input: BodyOf<operations["mysql-changePassword"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.changePassword", input);
    }

    async move<T = ResponseOf<"mysql-move">>(input: BodyOf<operations["mysql-move"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.move", input);
    }

    async rebuild<T = ResponseOf<"mysql-rebuild">>(input: BodyOf<operations["mysql-rebuild"]>): Promise<T> {
        return this.transport.mutate<T>("mysql.rebuild", input);
    }

    async search<T = ResponseOf<"mysql-search">>(input: QueryOf<operations["mysql-search"]>): Promise<T> {
        return this.transport.query<T>("mysql.search", input);
    }

    async readLogs<T = ResponseOf<"mysql-readLogs">>(input: QueryOf<operations["mysql-readLogs"]>): Promise<T> {
        return this.transport.query<T>("mysql.readLogs", input);
    }
}

export class NotificationRouter {
    constructor(private transport: Transport) {
    }

    async createSlack<T = ResponseOf<"notification-createSlack">>(input: BodyOf<operations["notification-createSlack"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createSlack", input);
    }

    async updateSlack<T = ResponseOf<"notification-updateSlack">>(input: BodyOf<operations["notification-updateSlack"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateSlack", input);
    }

    async testSlackConnection<T = ResponseOf<"notification-testSlackConnection">>(input: BodyOf<operations["notification-testSlackConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testSlackConnection", input);
    }

    async createTelegram<T = ResponseOf<"notification-createTelegram">>(input: BodyOf<operations["notification-createTelegram"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createTelegram", input);
    }

    async updateTelegram<T = ResponseOf<"notification-updateTelegram">>(input: BodyOf<operations["notification-updateTelegram"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateTelegram", input);
    }

    async testTelegramConnection<T = ResponseOf<"notification-testTelegramConnection">>(input: BodyOf<operations["notification-testTelegramConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testTelegramConnection", input);
    }

    async createDiscord<T = ResponseOf<"notification-createDiscord">>(input: BodyOf<operations["notification-createDiscord"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createDiscord", input);
    }

    async updateDiscord<T = ResponseOf<"notification-updateDiscord">>(input: BodyOf<operations["notification-updateDiscord"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateDiscord", input);
    }

    async testDiscordConnection<T = ResponseOf<"notification-testDiscordConnection">>(input: BodyOf<operations["notification-testDiscordConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testDiscordConnection", input);
    }

    async createEmail<T = ResponseOf<"notification-createEmail">>(input: BodyOf<operations["notification-createEmail"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createEmail", input);
    }

    async updateEmail<T = ResponseOf<"notification-updateEmail">>(input: BodyOf<operations["notification-updateEmail"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateEmail", input);
    }

    async testEmailConnection<T = ResponseOf<"notification-testEmailConnection">>(input: BodyOf<operations["notification-testEmailConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testEmailConnection", input);
    }

    async createResend<T = ResponseOf<"notification-createResend">>(input: BodyOf<operations["notification-createResend"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createResend", input);
    }

    async updateResend<T = ResponseOf<"notification-updateResend">>(input: BodyOf<operations["notification-updateResend"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateResend", input);
    }

    async testResendConnection<T = ResponseOf<"notification-testResendConnection">>(input: BodyOf<operations["notification-testResendConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testResendConnection", input);
    }

    async remove<T = ResponseOf<"notification-remove">>(input: BodyOf<operations["notification-remove"]>): Promise<T> {
        return this.transport.mutate<T>("notification.remove", input);
    }

    async one<T = ResponseOf<"notification-one">>(input: QueryOf<operations["notification-one"]>): Promise<T> {
        return this.transport.query<T>("notification.one", input);
    }

    async all<T = ResponseOf<"notification-all">>(): Promise<T> {
        return this.transport.query<T>("notification.all");
    }

    async receiveNotification<T = ResponseOf<"notification-receiveNotification">>(input: BodyOf<operations["notification-receiveNotification"]>): Promise<T> {
        return this.transport.mutate<T>("notification.receiveNotification", input);
    }

    async createGotify<T = ResponseOf<"notification-createGotify">>(input: BodyOf<operations["notification-createGotify"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createGotify", input);
    }

    async updateGotify<T = ResponseOf<"notification-updateGotify">>(input: BodyOf<operations["notification-updateGotify"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateGotify", input);
    }

    async testGotifyConnection<T = ResponseOf<"notification-testGotifyConnection">>(input: BodyOf<operations["notification-testGotifyConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testGotifyConnection", input);
    }

    async createNtfy<T = ResponseOf<"notification-createNtfy">>(input: BodyOf<operations["notification-createNtfy"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createNtfy", input);
    }

    async updateNtfy<T = ResponseOf<"notification-updateNtfy">>(input: BodyOf<operations["notification-updateNtfy"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateNtfy", input);
    }

    async testNtfyConnection<T = ResponseOf<"notification-testNtfyConnection">>(input: BodyOf<operations["notification-testNtfyConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testNtfyConnection", input);
    }

    async createMattermost<T = ResponseOf<"notification-createMattermost">>(input: BodyOf<operations["notification-createMattermost"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createMattermost", input);
    }

    async updateMattermost<T = ResponseOf<"notification-updateMattermost">>(input: BodyOf<operations["notification-updateMattermost"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateMattermost", input);
    }

    async testMattermostConnection<T = ResponseOf<"notification-testMattermostConnection">>(input: BodyOf<operations["notification-testMattermostConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testMattermostConnection", input);
    }

    async createCustom<T = ResponseOf<"notification-createCustom">>(input: BodyOf<operations["notification-createCustom"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createCustom", input);
    }

    async updateCustom<T = ResponseOf<"notification-updateCustom">>(input: BodyOf<operations["notification-updateCustom"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateCustom", input);
    }

    async testCustomConnection<T = ResponseOf<"notification-testCustomConnection">>(input: BodyOf<operations["notification-testCustomConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testCustomConnection", input);
    }

    async createLark<T = ResponseOf<"notification-createLark">>(input: BodyOf<operations["notification-createLark"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createLark", input);
    }

    async updateLark<T = ResponseOf<"notification-updateLark">>(input: BodyOf<operations["notification-updateLark"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateLark", input);
    }

    async testLarkConnection<T = ResponseOf<"notification-testLarkConnection">>(input: BodyOf<operations["notification-testLarkConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testLarkConnection", input);
    }

    async createTeams<T = ResponseOf<"notification-createTeams">>(input: BodyOf<operations["notification-createTeams"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createTeams", input);
    }

    async updateTeams<T = ResponseOf<"notification-updateTeams">>(input: BodyOf<operations["notification-updateTeams"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updateTeams", input);
    }

    async testTeamsConnection<T = ResponseOf<"notification-testTeamsConnection">>(input: BodyOf<operations["notification-testTeamsConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testTeamsConnection", input);
    }

    async createPushover<T = ResponseOf<"notification-createPushover">>(input: BodyOf<operations["notification-createPushover"]>): Promise<T> {
        return this.transport.mutate<T>("notification.createPushover", input);
    }

    async updatePushover<T = ResponseOf<"notification-updatePushover">>(input: BodyOf<operations["notification-updatePushover"]>): Promise<T> {
        return this.transport.mutate<T>("notification.updatePushover", input);
    }

    async testPushoverConnection<T = ResponseOf<"notification-testPushoverConnection">>(input: BodyOf<operations["notification-testPushoverConnection"]>): Promise<T> {
        return this.transport.mutate<T>("notification.testPushoverConnection", input);
    }

    async getEmailProviders<T = ResponseOf<"notification-getEmailProviders">>(): Promise<T> {
        return this.transport.query<T>("notification.getEmailProviders");
    }
}

export class OrganizationRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"organization-create">>(input: BodyOf<operations["organization-create"]>): Promise<T> {
        return this.transport.mutate<T>("organization.create", input);
    }

    async all<T = ResponseOf<"organization-all">>(): Promise<T> {
        return this.transport.query<T>("organization.all");
    }

    async one<T = ResponseOf<"organization-one">>(input: QueryOf<operations["organization-one"]>): Promise<T> {
        return this.transport.query<T>("organization.one", input);
    }

    async update<T = ResponseOf<"organization-update">>(input: BodyOf<operations["organization-update"]>): Promise<T> {
        return this.transport.mutate<T>("organization.update", input);
    }

    async delete<T = ResponseOf<"organization-delete">>(input: BodyOf<operations["organization-delete"]>): Promise<T> {
        return this.transport.mutate<T>("organization.delete", input);
    }

    async inviteMember<T = ResponseOf<"organization-inviteMember">>(input: BodyOf<operations["organization-inviteMember"]>): Promise<T> {
        return this.transport.mutate<T>("organization.inviteMember", input);
    }

    async allInvitations<T = ResponseOf<"organization-allInvitations">>(): Promise<T> {
        return this.transport.query<T>("organization.allInvitations");
    }

    async removeInvitation<T = ResponseOf<"organization-removeInvitation">>(input: BodyOf<operations["organization-removeInvitation"]>): Promise<T> {
        return this.transport.mutate<T>("organization.removeInvitation", input);
    }

    async updateMemberRole<T = ResponseOf<"organization-updateMemberRole">>(input: BodyOf<operations["organization-updateMemberRole"]>): Promise<T> {
        return this.transport.mutate<T>("organization.updateMemberRole", input);
    }

    async setDefault<T = ResponseOf<"organization-setDefault">>(input: BodyOf<operations["organization-setDefault"]>): Promise<T> {
        return this.transport.mutate<T>("organization.setDefault", input);
    }

    async active<T = ResponseOf<"organization-active">>(): Promise<T> {
        return this.transport.query<T>("organization.active");
    }
}

export class PatchRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"patch-create">>(input: BodyOf<operations["patch-create"]>): Promise<T> {
        return this.transport.mutate<T>("patch.create", input);
    }

    async one<T = ResponseOf<"patch-one">>(input: QueryOf<operations["patch-one"]>): Promise<T> {
        return this.transport.query<T>("patch.one", input);
    }

    async byEntityId<T = ResponseOf<"patch-byEntityId">>(input: QueryOf<operations["patch-byEntityId"]>): Promise<T> {
        return this.transport.query<T>("patch.byEntityId", input);
    }

    async update<T = ResponseOf<"patch-update">>(input: BodyOf<operations["patch-update"]>): Promise<T> {
        return this.transport.mutate<T>("patch.update", input);
    }

    async delete<T = ResponseOf<"patch-delete">>(input: BodyOf<operations["patch-delete"]>): Promise<T> {
        return this.transport.mutate<T>("patch.delete", input);
    }

    async toggleEnabled<T = ResponseOf<"patch-toggleEnabled">>(input: BodyOf<operations["patch-toggleEnabled"]>): Promise<T> {
        return this.transport.mutate<T>("patch.toggleEnabled", input);
    }

    async ensureRepo<T = ResponseOf<"patch-ensureRepo">>(input: BodyOf<operations["patch-ensureRepo"]>): Promise<T> {
        return this.transport.mutate<T>("patch.ensureRepo", input);
    }

    async readRepoDirectories<T = ResponseOf<"patch-readRepoDirectories">>(input: QueryOf<operations["patch-readRepoDirectories"]>): Promise<T> {
        return this.transport.query<T>("patch.readRepoDirectories", input);
    }

    async readRepoFile<T = ResponseOf<"patch-readRepoFile">>(input: QueryOf<operations["patch-readRepoFile"]>): Promise<T> {
        return this.transport.query<T>("patch.readRepoFile", input);
    }

    async saveFileAsPatch<T = ResponseOf<"patch-saveFileAsPatch">>(input: BodyOf<operations["patch-saveFileAsPatch"]>): Promise<T> {
        return this.transport.mutate<T>("patch.saveFileAsPatch", input);
    }

    async markFileForDeletion<T = ResponseOf<"patch-markFileForDeletion">>(input: BodyOf<operations["patch-markFileForDeletion"]>): Promise<T> {
        return this.transport.mutate<T>("patch.markFileForDeletion", input);
    }

    async cleanPatchRepos<T = ResponseOf<"patch-cleanPatchRepos">>(input: BodyOf<operations["patch-cleanPatchRepos"]>): Promise<T> {
        return this.transport.mutate<T>("patch.cleanPatchRepos", input);
    }
}

export class PortRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"port-create">>(input: BodyOf<operations["port-create"]>): Promise<T> {
        return this.transport.mutate<T>("port.create", input);
    }

    async one<T = ResponseOf<"port-one">>(input: QueryOf<operations["port-one"]>): Promise<T> {
        return this.transport.query<T>("port.one", input);
    }

    async delete<T = ResponseOf<"port-delete">>(input: BodyOf<operations["port-delete"]>): Promise<T> {
        return this.transport.mutate<T>("port.delete", input);
    }

    async update<T = ResponseOf<"port-update">>(input: BodyOf<operations["port-update"]>): Promise<T> {
        return this.transport.mutate<T>("port.update", input);
    }
}

export class PostgresRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"postgres-create">>(input: BodyOf<operations["postgres-create"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.create", input);
    }

    async one<T = ResponseOf<"postgres-one">>(input: QueryOf<operations["postgres-one"]>): Promise<T> {
        return this.transport.query<T>("postgres.one", input);
    }

    async start<T = ResponseOf<"postgres-start">>(input: BodyOf<operations["postgres-start"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.start", input);
    }

    async stop<T = ResponseOf<"postgres-stop">>(input: BodyOf<operations["postgres-stop"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.stop", input);
    }

    async saveExternalPort<T = ResponseOf<"postgres-saveExternalPort">>(input: BodyOf<operations["postgres-saveExternalPort"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.saveExternalPort", input);
    }

    async deploy<T = ResponseOf<"postgres-deploy">>(input: BodyOf<operations["postgres-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.deploy", input);
    }

    async changeStatus<T = ResponseOf<"postgres-changeStatus">>(input: BodyOf<operations["postgres-changeStatus"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.changeStatus", input);
    }

    async remove<T = ResponseOf<"postgres-remove">>(input: BodyOf<operations["postgres-remove"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.remove", input);
    }

    async saveEnvironment<T = ResponseOf<"postgres-saveEnvironment">>(input: BodyOf<operations["postgres-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.saveEnvironment", input);
    }

    async reload<T = ResponseOf<"postgres-reload">>(input: BodyOf<operations["postgres-reload"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.reload", input);
    }

    async update<T = ResponseOf<"postgres-update">>(input: BodyOf<operations["postgres-update"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.update", input);
    }

    async changePassword<T = ResponseOf<"postgres-changePassword">>(input: BodyOf<operations["postgres-changePassword"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.changePassword", input);
    }

    async move<T = ResponseOf<"postgres-move">>(input: BodyOf<operations["postgres-move"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.move", input);
    }

    async rebuild<T = ResponseOf<"postgres-rebuild">>(input: BodyOf<operations["postgres-rebuild"]>): Promise<T> {
        return this.transport.mutate<T>("postgres.rebuild", input);
    }

    async search<T = ResponseOf<"postgres-search">>(input: QueryOf<operations["postgres-search"]>): Promise<T> {
        return this.transport.query<T>("postgres.search", input);
    }

    async readLogs<T = ResponseOf<"postgres-readLogs">>(input: QueryOf<operations["postgres-readLogs"]>): Promise<T> {
        return this.transport.query<T>("postgres.readLogs", input);
    }
}

export class PreviewDeploymentRouter {
    constructor(private transport: Transport) {
    }

    async all<T = ResponseOf<"previewDeployment-all">>(input: QueryOf<operations["previewDeployment-all"]>): Promise<T> {
        return this.transport.query<T>("previewDeployment.all", input);
    }

    async one<T = ResponseOf<"previewDeployment-one">>(input: QueryOf<operations["previewDeployment-one"]>): Promise<T> {
        return this.transport.query<T>("previewDeployment.one", input);
    }

    async delete<T = ResponseOf<"previewDeployment-delete">>(input: BodyOf<operations["previewDeployment-delete"]>): Promise<T> {
        return this.transport.mutate<T>("previewDeployment.delete", input);
    }

    async redeploy<T = ResponseOf<"previewDeployment-redeploy">>(input: BodyOf<operations["previewDeployment-redeploy"]>): Promise<T> {
        return this.transport.mutate<T>("previewDeployment.redeploy", input);
    }
}

export class ProjectRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"project-create">>(input: BodyOf<operations["project-create"]>): Promise<T> {
        return this.transport.mutate<T>("project.create", input);
    }

    async one<T = ResponseOf<"project-one">>(input: QueryOf<operations["project-one"]>): Promise<T> {
        return this.transport.query<T>("project.one", input);
    }

    async all<T = ResponseOf<"project-all">>(): Promise<T> {
        return this.transport.query<T>("project.all");
    }

    async allForPermissions<T = ResponseOf<"project-allForPermissions">>(): Promise<T> {
        return this.transport.query<T>("project.allForPermissions");
    }

    async homeStats<T = ResponseOf<"project-homeStats">>(): Promise<T> {
        return this.transport.query<T>("project.homeStats");
    }

    async search<T = ResponseOf<"project-search">>(input: QueryOf<operations["project-search"]>): Promise<T> {
        return this.transport.query<T>("project.search", input);
    }

    async remove<T = ResponseOf<"project-remove">>(input: BodyOf<operations["project-remove"]>): Promise<T> {
        return this.transport.mutate<T>("project.remove", input);
    }

    async update<T = ResponseOf<"project-update">>(input: BodyOf<operations["project-update"]>): Promise<T> {
        return this.transport.mutate<T>("project.update", input);
    }

    async duplicate<T = ResponseOf<"project-duplicate">>(input: BodyOf<operations["project-duplicate"]>): Promise<T> {
        return this.transport.mutate<T>("project.duplicate", input);
    }
}

export class RedirectsRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"redirects-create">>(input: BodyOf<operations["redirects-create"]>): Promise<T> {
        return this.transport.mutate<T>("redirects.create", input);
    }

    async one<T = ResponseOf<"redirects-one">>(input: QueryOf<operations["redirects-one"]>): Promise<T> {
        return this.transport.query<T>("redirects.one", input);
    }

    async delete<T = ResponseOf<"redirects-delete">>(input: BodyOf<operations["redirects-delete"]>): Promise<T> {
        return this.transport.mutate<T>("redirects.delete", input);
    }

    async update<T = ResponseOf<"redirects-update">>(input: BodyOf<operations["redirects-update"]>): Promise<T> {
        return this.transport.mutate<T>("redirects.update", input);
    }
}

export class RedisRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"redis-create">>(input: BodyOf<operations["redis-create"]>): Promise<T> {
        return this.transport.mutate<T>("redis.create", input);
    }

    async one<T = ResponseOf<"redis-one">>(input: QueryOf<operations["redis-one"]>): Promise<T> {
        return this.transport.query<T>("redis.one", input);
    }

    async start<T = ResponseOf<"redis-start">>(input: BodyOf<operations["redis-start"]>): Promise<T> {
        return this.transport.mutate<T>("redis.start", input);
    }

    async reload<T = ResponseOf<"redis-reload">>(input: BodyOf<operations["redis-reload"]>): Promise<T> {
        return this.transport.mutate<T>("redis.reload", input);
    }

    async stop<T = ResponseOf<"redis-stop">>(input: BodyOf<operations["redis-stop"]>): Promise<T> {
        return this.transport.mutate<T>("redis.stop", input);
    }

    async saveExternalPort<T = ResponseOf<"redis-saveExternalPort">>(input: BodyOf<operations["redis-saveExternalPort"]>): Promise<T> {
        return this.transport.mutate<T>("redis.saveExternalPort", input);
    }

    async deploy<T = ResponseOf<"redis-deploy">>(input: BodyOf<operations["redis-deploy"]>): Promise<T> {
        return this.transport.mutate<T>("redis.deploy", input);
    }

    async changeStatus<T = ResponseOf<"redis-changeStatus">>(input: BodyOf<operations["redis-changeStatus"]>): Promise<T> {
        return this.transport.mutate<T>("redis.changeStatus", input);
    }

    async remove<T = ResponseOf<"redis-remove">>(input: BodyOf<operations["redis-remove"]>): Promise<T> {
        return this.transport.mutate<T>("redis.remove", input);
    }

    async saveEnvironment<T = ResponseOf<"redis-saveEnvironment">>(input: BodyOf<operations["redis-saveEnvironment"]>): Promise<T> {
        return this.transport.mutate<T>("redis.saveEnvironment", input);
    }

    async update<T = ResponseOf<"redis-update">>(input: BodyOf<operations["redis-update"]>): Promise<T> {
        return this.transport.mutate<T>("redis.update", input);
    }

    async changePassword<T = ResponseOf<"redis-changePassword">>(input: BodyOf<operations["redis-changePassword"]>): Promise<T> {
        return this.transport.mutate<T>("redis.changePassword", input);
    }

    async move<T = ResponseOf<"redis-move">>(input: BodyOf<operations["redis-move"]>): Promise<T> {
        return this.transport.mutate<T>("redis.move", input);
    }

    async rebuild<T = ResponseOf<"redis-rebuild">>(input: BodyOf<operations["redis-rebuild"]>): Promise<T> {
        return this.transport.mutate<T>("redis.rebuild", input);
    }

    async search<T = ResponseOf<"redis-search">>(input: QueryOf<operations["redis-search"]>): Promise<T> {
        return this.transport.query<T>("redis.search", input);
    }

    async readLogs<T = ResponseOf<"redis-readLogs">>(input: QueryOf<operations["redis-readLogs"]>): Promise<T> {
        return this.transport.query<T>("redis.readLogs", input);
    }
}

export class RegistryRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"registry-create">>(input: BodyOf<operations["registry-create"]>): Promise<T> {
        return this.transport.mutate<T>("registry.create", input);
    }

    async remove<T = ResponseOf<"registry-remove">>(input: BodyOf<operations["registry-remove"]>): Promise<T> {
        return this.transport.mutate<T>("registry.remove", input);
    }

    async update<T = ResponseOf<"registry-update">>(input: BodyOf<operations["registry-update"]>): Promise<T> {
        return this.transport.mutate<T>("registry.update", input);
    }

    async all<T = ResponseOf<"registry-all">>(): Promise<T> {
        return this.transport.query<T>("registry.all");
    }

    async one<T = ResponseOf<"registry-one">>(input: QueryOf<operations["registry-one"]>): Promise<T> {
        return this.transport.query<T>("registry.one", input);
    }

    async testRegistry<T = ResponseOf<"registry-testRegistry">>(input: BodyOf<operations["registry-testRegistry"]>): Promise<T> {
        return this.transport.mutate<T>("registry.testRegistry", input);
    }

    async testRegistryById<T = ResponseOf<"registry-testRegistryById">>(input: BodyOf<operations["registry-testRegistryById"]>): Promise<T> {
        return this.transport.mutate<T>("registry.testRegistryById", input);
    }
}

export class RollbackRouter {
    constructor(private transport: Transport) {
    }

    async delete<T = ResponseOf<"rollback-delete">>(input: BodyOf<operations["rollback-delete"]>): Promise<T> {
        return this.transport.mutate<T>("rollback.delete", input);
    }

    async rollback<T = ResponseOf<"rollback-rollback">>(input: BodyOf<operations["rollback-rollback"]>): Promise<T> {
        return this.transport.mutate<T>("rollback.rollback", input);
    }
}

export class ScheduleRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"schedule-create">>(input: BodyOf<operations["schedule-create"]>): Promise<T> {
        return this.transport.mutate<T>("schedule.create", input);
    }

    async update<T = ResponseOf<"schedule-update">>(input: BodyOf<operations["schedule-update"]>): Promise<T> {
        return this.transport.mutate<T>("schedule.update", input);
    }

    async delete<T = ResponseOf<"schedule-delete">>(input: BodyOf<operations["schedule-delete"]>): Promise<T> {
        return this.transport.mutate<T>("schedule.delete", input);
    }

    async list<T = ResponseOf<"schedule-list">>(input: QueryOf<operations["schedule-list"]>): Promise<T> {
        return this.transport.query<T>("schedule.list", input);
    }

    async one<T = ResponseOf<"schedule-one">>(input: QueryOf<operations["schedule-one"]>): Promise<T> {
        return this.transport.query<T>("schedule.one", input);
    }

    async runManually<T = ResponseOf<"schedule-runManually">>(input: BodyOf<operations["schedule-runManually"]>): Promise<T> {
        return this.transport.mutate<T>("schedule.runManually", input);
    }
}

export class SecurityRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"security-create">>(input: BodyOf<operations["security-create"]>): Promise<T> {
        return this.transport.mutate<T>("security.create", input);
    }

    async one<T = ResponseOf<"security-one">>(input: QueryOf<operations["security-one"]>): Promise<T> {
        return this.transport.query<T>("security.one", input);
    }

    async delete<T = ResponseOf<"security-delete">>(input: BodyOf<operations["security-delete"]>): Promise<T> {
        return this.transport.mutate<T>("security.delete", input);
    }

    async update<T = ResponseOf<"security-update">>(input: BodyOf<operations["security-update"]>): Promise<T> {
        return this.transport.mutate<T>("security.update", input);
    }
}

export class ServerRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"server-create">>(input: BodyOf<operations["server-create"]>): Promise<T> {
        return this.transport.mutate<T>("server.create", input);
    }

    async one<T = ResponseOf<"server-one">>(input: QueryOf<operations["server-one"]>): Promise<T> {
        return this.transport.query<T>("server.one", input);
    }

    async getDefaultCommand<T = ResponseOf<"server-getDefaultCommand">>(input: QueryOf<operations["server-getDefaultCommand"]>): Promise<T> {
        return this.transport.query<T>("server.getDefaultCommand", input);
    }

    async all<T = ResponseOf<"server-all">>(): Promise<T> {
        return this.transport.query<T>("server.all");
    }

    async allForPermissions<T = ResponseOf<"server-allForPermissions">>(): Promise<T> {
        return this.transport.query<T>("server.allForPermissions");
    }

    async count<T = ResponseOf<"server-count">>(): Promise<T> {
        return this.transport.query<T>("server.count");
    }

    async withSSHKey<T = ResponseOf<"server-withSSHKey">>(): Promise<T> {
        return this.transport.query<T>("server.withSSHKey");
    }

    async buildServers<T = ResponseOf<"server-buildServers">>(): Promise<T> {
        return this.transport.query<T>("server.buildServers");
    }

    async setup<T = ResponseOf<"server-setup">>(input: BodyOf<operations["server-setup"]>): Promise<T> {
        return this.transport.mutate<T>("server.setup", input);
    }

    async validate<T = ResponseOf<"server-validate">>(input: QueryOf<operations["server-validate"]>): Promise<T> {
        return this.transport.query<T>("server.validate", input);
    }

    async security<T = ResponseOf<"server-security">>(input: QueryOf<operations["server-security"]>): Promise<T> {
        return this.transport.query<T>("server.security", input);
    }

    async setupMonitoring<T = ResponseOf<"server-setupMonitoring">>(input: BodyOf<operations["server-setupMonitoring"]>): Promise<T> {
        return this.transport.mutate<T>("server.setupMonitoring", input);
    }

    async remove<T = ResponseOf<"server-remove">>(input: BodyOf<operations["server-remove"]>): Promise<T> {
        return this.transport.mutate<T>("server.remove", input);
    }

    async update<T = ResponseOf<"server-update">>(input: BodyOf<operations["server-update"]>): Promise<T> {
        return this.transport.mutate<T>("server.update", input);
    }

    async updateBuildsConcurrency<T = ResponseOf<"server-updateBuildsConcurrency">>(input: BodyOf<operations["server-updateBuildsConcurrency"]>): Promise<T> {
        return this.transport.mutate<T>("server.updateBuildsConcurrency", input);
    }

    async publicIp<T = ResponseOf<"server-publicIp">>(): Promise<T> {
        return this.transport.query<T>("server.publicIp");
    }

    async getServerTime<T = ResponseOf<"server-getServerTime">>(): Promise<T> {
        return this.transport.query<T>("server.getServerTime");
    }

    async getServerMetrics<T = ResponseOf<"server-getServerMetrics">>(input: QueryOf<operations["server-getServerMetrics"]>): Promise<T> {
        return this.transport.query<T>("server.getServerMetrics", input);
    }
}

export class SettingsRouter {
    constructor(private transport: Transport) {
    }

    async getWebServerSettings<T = ResponseOf<"settings-getWebServerSettings">>(): Promise<T> {
        return this.transport.query<T>("settings.getWebServerSettings");
    }

    async reloadServer<T = ResponseOf<"settings-reloadServer">>(): Promise<T> {
        return this.transport.mutate<T>("settings.reloadServer", {});
    }

    async cleanRedis<T = ResponseOf<"settings-cleanRedis">>(): Promise<T> {
        return this.transport.mutate<T>("settings.cleanRedis", {});
    }

    async reloadRedis<T = ResponseOf<"settings-reloadRedis">>(): Promise<T> {
        return this.transport.mutate<T>("settings.reloadRedis", {});
    }

    async cleanAllDeploymentQueue<T = ResponseOf<"settings-cleanAllDeploymentQueue">>(): Promise<T> {
        return this.transport.mutate<T>("settings.cleanAllDeploymentQueue", {});
    }

    async reloadTraefik<T = ResponseOf<"settings-reloadTraefik">>(input: BodyOf<operations["settings-reloadTraefik"]>): Promise<T> {
        return this.transport.mutate<T>("settings.reloadTraefik", input);
    }

    async toggleDashboard<T = ResponseOf<"settings-toggleDashboard">>(input: BodyOf<operations["settings-toggleDashboard"]>): Promise<T> {
        return this.transport.mutate<T>("settings.toggleDashboard", input);
    }

    async cleanUnusedImages<T = ResponseOf<"settings-cleanUnusedImages">>(input: BodyOf<operations["settings-cleanUnusedImages"]>): Promise<T> {
        return this.transport.mutate<T>("settings.cleanUnusedImages", input);
    }

    async cleanUnusedVolumes<T = ResponseOf<"settings-cleanUnusedVolumes">>(input: BodyOf<operations["settings-cleanUnusedVolumes"]>): Promise<T> {
        return this.transport.mutate<T>("settings.cleanUnusedVolumes", input);
    }

    async cleanStoppedContainers<T = ResponseOf<"settings-cleanStoppedContainers">>(input: BodyOf<operations["settings-cleanStoppedContainers"]>): Promise<T> {
        return this.transport.mutate<T>("settings.cleanStoppedContainers", input);
    }

    async cleanDockerBuilder<T = ResponseOf<"settings-cleanDockerBuilder">>(input: BodyOf<operations["settings-cleanDockerBuilder"]>): Promise<T> {
        return this.transport.mutate<T>("settings.cleanDockerBuilder", input);
    }

    async cleanDockerPrune<T = ResponseOf<"settings-cleanDockerPrune">>(input: BodyOf<operations["settings-cleanDockerPrune"]>): Promise<T> {
        return this.transport.mutate<T>("settings.cleanDockerPrune", input);
    }

    async cleanAll<T = ResponseOf<"settings-cleanAll">>(input: BodyOf<operations["settings-cleanAll"]>): Promise<T> {
        return this.transport.mutate<T>("settings.cleanAll", input);
    }

    async cleanMonitoring<T = ResponseOf<"settings-cleanMonitoring">>(): Promise<T> {
        return this.transport.mutate<T>("settings.cleanMonitoring", {});
    }

    async getDockerDiskUsage<T = ResponseOf<"settings-getDockerDiskUsage">>(): Promise<T> {
        return this.transport.query<T>("settings.getDockerDiskUsage");
    }

    async saveSSHPrivateKey<T = ResponseOf<"settings-saveSSHPrivateKey">>(input: BodyOf<operations["settings-saveSSHPrivateKey"]>): Promise<T> {
        return this.transport.mutate<T>("settings.saveSSHPrivateKey", input);
    }

    async assignDomainServer<T = ResponseOf<"settings-assignDomainServer">>(input: BodyOf<operations["settings-assignDomainServer"]>): Promise<T> {
        return this.transport.mutate<T>("settings.assignDomainServer", input);
    }

    async cleanSSHPrivateKey<T = ResponseOf<"settings-cleanSSHPrivateKey">>(): Promise<T> {
        return this.transport.mutate<T>("settings.cleanSSHPrivateKey", {});
    }

    async updateDockerCleanup<T = ResponseOf<"settings-updateDockerCleanup">>(input: BodyOf<operations["settings-updateDockerCleanup"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateDockerCleanup", input);
    }

    async updateRemoteServersOnly<T = ResponseOf<"settings-updateRemoteServersOnly">>(input: BodyOf<operations["settings-updateRemoteServersOnly"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateRemoteServersOnly", input);
    }

    async updateBuildsConcurrency<T = ResponseOf<"settings-updateBuildsConcurrency">>(input: BodyOf<operations["settings-updateBuildsConcurrency"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateBuildsConcurrency", input);
    }

    async updateEnforceSSO<T = ResponseOf<"settings-updateEnforceSSO">>(input: BodyOf<operations["settings-updateEnforceSSO"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateEnforceSSO", input);
    }

    async readTraefikConfig<T = ResponseOf<"settings-readTraefikConfig">>(): Promise<T> {
        return this.transport.query<T>("settings.readTraefikConfig");
    }

    async updateTraefikConfig<T = ResponseOf<"settings-updateTraefikConfig">>(input: BodyOf<operations["settings-updateTraefikConfig"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateTraefikConfig", input);
    }

    async readWebServerTraefikConfig<T = ResponseOf<"settings-readWebServerTraefikConfig">>(): Promise<T> {
        return this.transport.query<T>("settings.readWebServerTraefikConfig");
    }

    async updateWebServerTraefikConfig<T = ResponseOf<"settings-updateWebServerTraefikConfig">>(input: BodyOf<operations["settings-updateWebServerTraefikConfig"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateWebServerTraefikConfig", input);
    }

    async readMiddlewareTraefikConfig<T = ResponseOf<"settings-readMiddlewareTraefikConfig">>(): Promise<T> {
        return this.transport.query<T>("settings.readMiddlewareTraefikConfig");
    }

    async updateMiddlewareTraefikConfig<T = ResponseOf<"settings-updateMiddlewareTraefikConfig">>(input: BodyOf<operations["settings-updateMiddlewareTraefikConfig"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateMiddlewareTraefikConfig", input);
    }

    async getUpdateData<T = ResponseOf<"settings-getUpdateData">>(): Promise<T> {
        return this.transport.mutate<T>("settings.getUpdateData", {});
    }

    async updateServer<T = ResponseOf<"settings-updateServer">>(): Promise<T> {
        return this.transport.mutate<T>("settings.updateServer", {});
    }

    async getDokployVersion<T = ResponseOf<"settings-getDokployVersion">>(): Promise<T> {
        return this.transport.query<T>("settings.getDokployVersion");
    }

    async getReleaseTag<T = ResponseOf<"settings-getReleaseTag">>(): Promise<T> {
        return this.transport.query<T>("settings.getReleaseTag");
    }

    async readDirectories<T = ResponseOf<"settings-readDirectories">>(input: QueryOf<operations["settings-readDirectories"]>): Promise<T> {
        return this.transport.query<T>("settings.readDirectories", input);
    }

    async updateTraefikFile<T = ResponseOf<"settings-updateTraefikFile">>(input: BodyOf<operations["settings-updateTraefikFile"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateTraefikFile", input);
    }

    async readTraefikFile<T = ResponseOf<"settings-readTraefikFile">>(input: QueryOf<operations["settings-readTraefikFile"]>): Promise<T> {
        return this.transport.query<T>("settings.readTraefikFile", input);
    }

    async getIp<T = ResponseOf<"settings-getIp">>(): Promise<T> {
        return this.transport.query<T>("settings.getIp");
    }

    async updateServerIp<T = ResponseOf<"settings-updateServerIp">>(input: BodyOf<operations["settings-updateServerIp"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateServerIp", input);
    }

    async getOpenApiDocument<T = ResponseOf<"settings-getOpenApiDocument">>(): Promise<T> {
        return this.transport.query<T>("settings.getOpenApiDocument");
    }

    async readTraefikEnv<T = ResponseOf<"settings-readTraefikEnv">>(input: QueryOf<operations["settings-readTraefikEnv"]>): Promise<T> {
        return this.transport.query<T>("settings.readTraefikEnv", input);
    }

    async writeTraefikEnv<T = ResponseOf<"settings-writeTraefikEnv">>(input: BodyOf<operations["settings-writeTraefikEnv"]>): Promise<T> {
        return this.transport.mutate<T>("settings.writeTraefikEnv", input);
    }

    async haveTraefikDashboardPortEnabled<T = ResponseOf<"settings-haveTraefikDashboardPortEnabled">>(input: QueryOf<operations["settings-haveTraefikDashboardPortEnabled"]>): Promise<T> {
        return this.transport.query<T>("settings.haveTraefikDashboardPortEnabled", input);
    }

    async haveActivateRequests<T = ResponseOf<"settings-haveActivateRequests">>(): Promise<T> {
        return this.transport.query<T>("settings.haveActivateRequests");
    }

    async toggleRequests<T = ResponseOf<"settings-toggleRequests">>(input: BodyOf<operations["settings-toggleRequests"]>): Promise<T> {
        return this.transport.mutate<T>("settings.toggleRequests", input);
    }

    async isCloud<T = ResponseOf<"settings-isCloud">>(): Promise<T> {
        return this.transport.query<T>("settings.isCloud");
    }

    async isUserSubscribed<T = ResponseOf<"settings-isUserSubscribed">>(): Promise<T> {
        return this.transport.query<T>("settings.isUserSubscribed");
    }

    async health<T = ResponseOf<"settings-health">>(): Promise<T> {
        return this.transport.query<T>("settings.health");
    }

    async checkInfrastructureHealth<T = ResponseOf<"settings-checkInfrastructureHealth">>(): Promise<T> {
        return this.transport.query<T>("settings.checkInfrastructureHealth");
    }

    async setupGPU<T = ResponseOf<"settings-setupGPU">>(input: BodyOf<operations["settings-setupGPU"]>): Promise<T> {
        return this.transport.mutate<T>("settings.setupGPU", input);
    }

    async checkGPUStatus<T = ResponseOf<"settings-checkGPUStatus">>(input: QueryOf<operations["settings-checkGPUStatus"]>): Promise<T> {
        return this.transport.query<T>("settings.checkGPUStatus", input);
    }

    async updateTraefikPorts<T = ResponseOf<"settings-updateTraefikPorts">>(input: BodyOf<operations["settings-updateTraefikPorts"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateTraefikPorts", input);
    }

    async getTraefikPorts<T = ResponseOf<"settings-getTraefikPorts">>(input: QueryOf<operations["settings-getTraefikPorts"]>): Promise<T> {
        return this.transport.query<T>("settings.getTraefikPorts", input);
    }

    async updateLogCleanup<T = ResponseOf<"settings-updateLogCleanup">>(input: BodyOf<operations["settings-updateLogCleanup"]>): Promise<T> {
        return this.transport.mutate<T>("settings.updateLogCleanup", input);
    }

    async getLogCleanupStatus<T = ResponseOf<"settings-getLogCleanupStatus">>(): Promise<T> {
        return this.transport.query<T>("settings.getLogCleanupStatus");
    }

    async getDokployCloudIps<T = ResponseOf<"settings-getDokployCloudIps">>(): Promise<T> {
        return this.transport.query<T>("settings.getDokployCloudIps");
    }
}

export class SshKeyRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"sshKey-create">>(input: BodyOf<operations["sshKey-create"]>): Promise<T> {
        return this.transport.mutate<T>("sshKey.create", input);
    }

    async remove<T = ResponseOf<"sshKey-remove">>(input: BodyOf<operations["sshKey-remove"]>): Promise<T> {
        return this.transport.mutate<T>("sshKey.remove", input);
    }

    async one<T = ResponseOf<"sshKey-one">>(input: QueryOf<operations["sshKey-one"]>): Promise<T> {
        return this.transport.query<T>("sshKey.one", input);
    }

    async all<T = ResponseOf<"sshKey-all">>(): Promise<T> {
        return this.transport.query<T>("sshKey.all");
    }

    async allForApps<T = ResponseOf<"sshKey-allForApps">>(): Promise<T> {
        return this.transport.query<T>("sshKey.allForApps");
    }

    async generate<T = ResponseOf<"sshKey-generate">>(input: BodyOf<operations["sshKey-generate"]>): Promise<T> {
        return this.transport.mutate<T>("sshKey.generate", input);
    }

    async update<T = ResponseOf<"sshKey-update">>(input: BodyOf<operations["sshKey-update"]>): Promise<T> {
        return this.transport.mutate<T>("sshKey.update", input);
    }
}

export class SsoRouter {
    constructor(private transport: Transport) {
    }

    async showSignInWithSSO<T = ResponseOf<"sso-showSignInWithSSO">>(): Promise<T> {
        return this.transport.query<T>("sso.showSignInWithSSO");
    }

    async enforceSSO<T = ResponseOf<"sso-enforceSSO">>(): Promise<T> {
        return this.transport.query<T>("sso.enforceSSO");
    }

    async listProviders<T = ResponseOf<"sso-listProviders">>(): Promise<T> {
        return this.transport.query<T>("sso.listProviders");
    }

    async getTrustedOrigins<T = ResponseOf<"sso-getTrustedOrigins">>(): Promise<T> {
        return this.transport.query<T>("sso.getTrustedOrigins");
    }

    async one<T = ResponseOf<"sso-one">>(input: QueryOf<operations["sso-one"]>): Promise<T> {
        return this.transport.query<T>("sso.one", input);
    }

    async update<T = ResponseOf<"sso-update">>(input: BodyOf<operations["sso-update"]>): Promise<T> {
        return this.transport.mutate<T>("sso.update", input);
    }

    async deleteProvider<T = ResponseOf<"sso-deleteProvider">>(input: BodyOf<operations["sso-deleteProvider"]>): Promise<T> {
        return this.transport.mutate<T>("sso.deleteProvider", input);
    }

    async register<T = ResponseOf<"sso-register">>(input: BodyOf<operations["sso-register"]>): Promise<T> {
        return this.transport.mutate<T>("sso.register", input);
    }

    async addTrustedOrigin<T = ResponseOf<"sso-addTrustedOrigin">>(input: BodyOf<operations["sso-addTrustedOrigin"]>): Promise<T> {
        return this.transport.mutate<T>("sso.addTrustedOrigin", input);
    }

    async removeTrustedOrigin<T = ResponseOf<"sso-removeTrustedOrigin">>(input: BodyOf<operations["sso-removeTrustedOrigin"]>): Promise<T> {
        return this.transport.mutate<T>("sso.removeTrustedOrigin", input);
    }

    async updateTrustedOrigin<T = ResponseOf<"sso-updateTrustedOrigin">>(input: BodyOf<operations["sso-updateTrustedOrigin"]>): Promise<T> {
        return this.transport.mutate<T>("sso.updateTrustedOrigin", input);
    }
}

export class StripeRouter {
    constructor(private transport: Transport) {
    }

    async getCurrentPlan<T = ResponseOf<"stripe-getCurrentPlan">>(): Promise<T> {
        return this.transport.query<T>("stripe.getCurrentPlan");
    }

    async getProducts<T = ResponseOf<"stripe-getProducts">>(): Promise<T> {
        return this.transport.query<T>("stripe.getProducts");
    }

    async createCheckoutSession<T = ResponseOf<"stripe-createCheckoutSession">>(input: BodyOf<operations["stripe-createCheckoutSession"]>): Promise<T> {
        return this.transport.mutate<T>("stripe.createCheckoutSession", input);
    }

    async createCustomerPortalSession<T = ResponseOf<"stripe-createCustomerPortalSession">>(): Promise<T> {
        return this.transport.mutate<T>("stripe.createCustomerPortalSession", {});
    }

    async upgradeSubscription<T = ResponseOf<"stripe-upgradeSubscription">>(input: BodyOf<operations["stripe-upgradeSubscription"]>): Promise<T> {
        return this.transport.mutate<T>("stripe.upgradeSubscription", input);
    }

    async canCreateMoreServers<T = ResponseOf<"stripe-canCreateMoreServers">>(): Promise<T> {
        return this.transport.query<T>("stripe.canCreateMoreServers");
    }

    async updateInvoiceNotifications<T = ResponseOf<"stripe-updateInvoiceNotifications">>(input: BodyOf<operations["stripe-updateInvoiceNotifications"]>): Promise<T> {
        return this.transport.mutate<T>("stripe.updateInvoiceNotifications", input);
    }

    async getInvoices<T = ResponseOf<"stripe-getInvoices">>(): Promise<T> {
        return this.transport.query<T>("stripe.getInvoices");
    }
}

export class SwarmRouter {
    constructor(private transport: Transport) {
    }

    async getNodes<T = ResponseOf<"swarm-getNodes">>(input: QueryOf<operations["swarm-getNodes"]>): Promise<T> {
        return this.transport.query<T>("swarm.getNodes", input);
    }

    async getNodeInfo<T = ResponseOf<"swarm-getNodeInfo">>(input: QueryOf<operations["swarm-getNodeInfo"]>): Promise<T> {
        return this.transport.query<T>("swarm.getNodeInfo", input);
    }

    async getNodeApps<T = ResponseOf<"swarm-getNodeApps">>(input: QueryOf<operations["swarm-getNodeApps"]>): Promise<T> {
        return this.transport.query<T>("swarm.getNodeApps", input);
    }

    async getContainerStats<T = ResponseOf<"swarm-getContainerStats">>(input: QueryOf<operations["swarm-getContainerStats"]>): Promise<T> {
        return this.transport.query<T>("swarm.getContainerStats", input);
    }
}

export class TagRouter {
    constructor(private transport: Transport) {
    }

    async create<T = ResponseOf<"tag-create">>(input: BodyOf<operations["tag-create"]>): Promise<T> {
        return this.transport.mutate<T>("tag.create", input);
    }

    async all<T = ResponseOf<"tag-all">>(): Promise<T> {
        return this.transport.query<T>("tag.all");
    }

    async one<T = ResponseOf<"tag-one">>(input: QueryOf<operations["tag-one"]>): Promise<T> {
        return this.transport.query<T>("tag.one", input);
    }

    async update<T = ResponseOf<"tag-update">>(input: BodyOf<operations["tag-update"]>): Promise<T> {
        return this.transport.mutate<T>("tag.update", input);
    }

    async remove<T = ResponseOf<"tag-remove">>(input: BodyOf<operations["tag-remove"]>): Promise<T> {
        return this.transport.mutate<T>("tag.remove", input);
    }

    async assignToProject<T = ResponseOf<"tag-assignToProject">>(input: BodyOf<operations["tag-assignToProject"]>): Promise<T> {
        return this.transport.mutate<T>("tag.assignToProject", input);
    }

    async removeFromProject<T = ResponseOf<"tag-removeFromProject">>(input: BodyOf<operations["tag-removeFromProject"]>): Promise<T> {
        return this.transport.mutate<T>("tag.removeFromProject", input);
    }

    async bulkAssign<T = ResponseOf<"tag-bulkAssign">>(input: BodyOf<operations["tag-bulkAssign"]>): Promise<T> {
        return this.transport.mutate<T>("tag.bulkAssign", input);
    }
}

export class UserRouter {
    constructor(private transport: Transport) {
    }

    async all<T = ResponseOf<"user-all">>(): Promise<T> {
        return this.transport.query<T>("user.all");
    }

    async one<T = ResponseOf<"user-one">>(input: QueryOf<operations["user-one"]>): Promise<T> {
        return this.transport.query<T>("user.one", input);
    }

    async session<T = ResponseOf<"user-session">>(): Promise<T> {
        return this.transport.query<T>("user.session");
    }

    async get<T = ResponseOf<"user-get">>(): Promise<T> {
        return this.transport.query<T>("user.get");
    }

    async getPermissions<T = ResponseOf<"user-getPermissions">>(): Promise<T> {
        return this.transport.query<T>("user.getPermissions");
    }

    async haveRootAccess<T = ResponseOf<"user-haveRootAccess">>(): Promise<T> {
        return this.transport.query<T>("user.haveRootAccess");
    }

    async getBackups<T = ResponseOf<"user-getBackups">>(): Promise<T> {
        return this.transport.query<T>("user.getBackups");
    }

    async getServerMetrics<T = ResponseOf<"user-getServerMetrics">>(): Promise<T> {
        return this.transport.query<T>("user.getServerMetrics");
    }

    async update<T = ResponseOf<"user-update">>(input: BodyOf<operations["user-update"]>): Promise<T> {
        return this.transport.mutate<T>("user.update", input);
    }

    async getUserByToken<T = ResponseOf<"user-getUserByToken">>(input: QueryOf<operations["user-getUserByToken"]>): Promise<T> {
        return this.transport.query<T>("user.getUserByToken", input);
    }

    async getMetricsToken<T = ResponseOf<"user-getMetricsToken">>(): Promise<T> {
        return this.transport.query<T>("user.getMetricsToken");
    }

    async remove<T = ResponseOf<"user-remove">>(input: BodyOf<operations["user-remove"]>): Promise<T> {
        return this.transport.mutate<T>("user.remove", input);
    }

    async assignPermissions<T = ResponseOf<"user-assignPermissions">>(input: BodyOf<operations["user-assignPermissions"]>): Promise<T> {
        return this.transport.mutate<T>("user.assignPermissions", input);
    }

    async getInvitations<T = ResponseOf<"user-getInvitations">>(): Promise<T> {
        return this.transport.query<T>("user.getInvitations");
    }

    async getContainerMetrics<T = ResponseOf<"user-getContainerMetrics">>(input: QueryOf<operations["user-getContainerMetrics"]>): Promise<T> {
        return this.transport.query<T>("user.getContainerMetrics", input);
    }

    async generateToken<T = ResponseOf<"user-generateToken">>(): Promise<T> {
        return this.transport.mutate<T>("user.generateToken", {});
    }

    async deleteApiKey<T = ResponseOf<"user-deleteApiKey">>(input: BodyOf<operations["user-deleteApiKey"]>): Promise<T> {
        return this.transport.mutate<T>("user.deleteApiKey", input);
    }

    async createApiKey<T = ResponseOf<"user-createApiKey">>(input: BodyOf<operations["user-createApiKey"]>): Promise<T> {
        return this.transport.mutate<T>("user.createApiKey", input);
    }

    async checkUserOrganizations<T = ResponseOf<"user-checkUserOrganizations">>(input: QueryOf<operations["user-checkUserOrganizations"]>): Promise<T> {
        return this.transport.query<T>("user.checkUserOrganizations", input);
    }

    async createUserWithCredentials<T = ResponseOf<"user-createUserWithCredentials">>(input: BodyOf<operations["user-createUserWithCredentials"]>): Promise<T> {
        return this.transport.mutate<T>("user.createUserWithCredentials", input);
    }

    async sendInvitation<T = ResponseOf<"user-sendInvitation">>(input: BodyOf<operations["user-sendInvitation"]>): Promise<T> {
        return this.transport.mutate<T>("user.sendInvitation", input);
    }

    async getBookmarkedTemplates<T = ResponseOf<"user-getBookmarkedTemplates">>(): Promise<T> {
        return this.transport.query<T>("user.getBookmarkedTemplates");
    }

    async toggleTemplateBookmark<T = ResponseOf<"user-toggleTemplateBookmark">>(input: BodyOf<operations["user-toggleTemplateBookmark"]>): Promise<T> {
        return this.transport.mutate<T>("user.toggleTemplateBookmark", input);
    }
}

export class VolumeBackupsRouter {
    constructor(private transport: Transport) {
    }

    async list<T = ResponseOf<"volumeBackups-list">>(input: QueryOf<operations["volumeBackups-list"]>): Promise<T> {
        return this.transport.query<T>("volumeBackups.list", input);
    }

    async create<T = ResponseOf<"volumeBackups-create">>(input: BodyOf<operations["volumeBackups-create"]>): Promise<T> {
        return this.transport.mutate<T>("volumeBackups.create", input);
    }

    async one<T = ResponseOf<"volumeBackups-one">>(input: QueryOf<operations["volumeBackups-one"]>): Promise<T> {
        return this.transport.query<T>("volumeBackups.one", input);
    }

    async delete<T = ResponseOf<"volumeBackups-delete">>(input: BodyOf<operations["volumeBackups-delete"]>): Promise<T> {
        return this.transport.mutate<T>("volumeBackups.delete", input);
    }

    async update<T = ResponseOf<"volumeBackups-update">>(input: BodyOf<operations["volumeBackups-update"]>): Promise<T> {
        return this.transport.mutate<T>("volumeBackups.update", input);
    }

    async runManually<T = ResponseOf<"volumeBackups-runManually">>(input: BodyOf<operations["volumeBackups-runManually"]>): Promise<T> {
        return this.transport.mutate<T>("volumeBackups.runManually", input);
    }
}

export class WhitelabelingRouter {
    constructor(private transport: Transport) {
    }

    async get<T = ResponseOf<"whitelabeling-get">>(): Promise<T> {
        return this.transport.query<T>("whitelabeling.get");
    }

    async update<T = ResponseOf<"whitelabeling-update">>(input: BodyOf<operations["whitelabeling-update"]>): Promise<T> {
        return this.transport.mutate<T>("whitelabeling.update", input);
    }

    async reset<T = ResponseOf<"whitelabeling-reset">>(): Promise<T> {
        return this.transport.mutate<T>("whitelabeling.reset", {});
    }

    async getPublic<T = ResponseOf<"whitelabeling-getPublic">>(): Promise<T> {
        return this.transport.query<T>("whitelabeling.getPublic");
    }
}

export interface AllRouters {
    admin: AdminRouter;
    ai: AiRouter;
    application: ApplicationRouter;
    auditLog: AuditLogRouter;
    backup: BackupRouter;
    bitbucket: BitbucketRouter;
    certificates: CertificatesRouter;
    cluster: ClusterRouter;
    compose: ComposeRouter;
    customRole: CustomRoleRouter;
    deployment: DeploymentRouter;
    destination: DestinationRouter;
    docker: DockerRouter;
    domain: DomainRouter;
    environment: EnvironmentRouter;
    forwardAuth: ForwardAuthRouter;
    gitea: GiteaRouter;
    github: GithubRouter;
    gitlab: GitlabRouter;
    gitProvider: GitProviderRouter;
    libsql: LibsqlRouter;
    licenseKey: LicenseKeyRouter;
    mariadb: MariadbRouter;
    mongo: MongoRouter;
    mounts: MountsRouter;
    mysql: MysqlRouter;
    notification: NotificationRouter;
    organization: OrganizationRouter;
    patch: PatchRouter;
    port: PortRouter;
    postgres: PostgresRouter;
    previewDeployment: PreviewDeploymentRouter;
    project: ProjectRouter;
    redirects: RedirectsRouter;
    redis: RedisRouter;
    registry: RegistryRouter;
    rollback: RollbackRouter;
    schedule: ScheduleRouter;
    security: SecurityRouter;
    server: ServerRouter;
    settings: SettingsRouter;
    sshKey: SshKeyRouter;
    sso: SsoRouter;
    stripe: StripeRouter;
    swarm: SwarmRouter;
    tag: TagRouter;
    user: UserRouter;
    volumeBackups: VolumeBackupsRouter;
    whitelabeling: WhitelabelingRouter;
}

export function createAllRouters(transport: Transport): AllRouters {
    return {
        admin: new AdminRouter(transport),
        ai: new AiRouter(transport),
        application: new ApplicationRouter(transport),
        auditLog: new AuditLogRouter(transport),
        backup: new BackupRouter(transport),
        bitbucket: new BitbucketRouter(transport),
        certificates: new CertificatesRouter(transport),
        cluster: new ClusterRouter(transport),
        compose: new ComposeRouter(transport),
        customRole: new CustomRoleRouter(transport),
        deployment: new DeploymentRouter(transport),
        destination: new DestinationRouter(transport),
        docker: new DockerRouter(transport),
        domain: new DomainRouter(transport),
        environment: new EnvironmentRouter(transport),
        forwardAuth: new ForwardAuthRouter(transport),
        gitea: new GiteaRouter(transport),
        github: new GithubRouter(transport),
        gitlab: new GitlabRouter(transport),
        gitProvider: new GitProviderRouter(transport),
        libsql: new LibsqlRouter(transport),
        licenseKey: new LicenseKeyRouter(transport),
        mariadb: new MariadbRouter(transport),
        mongo: new MongoRouter(transport),
        mounts: new MountsRouter(transport),
        mysql: new MysqlRouter(transport),
        notification: new NotificationRouter(transport),
        organization: new OrganizationRouter(transport),
        patch: new PatchRouter(transport),
        port: new PortRouter(transport),
        postgres: new PostgresRouter(transport),
        previewDeployment: new PreviewDeploymentRouter(transport),
        project: new ProjectRouter(transport),
        redirects: new RedirectsRouter(transport),
        redis: new RedisRouter(transport),
        registry: new RegistryRouter(transport),
        rollback: new RollbackRouter(transport),
        schedule: new ScheduleRouter(transport),
        security: new SecurityRouter(transport),
        server: new ServerRouter(transport),
        settings: new SettingsRouter(transport),
        sshKey: new SshKeyRouter(transport),
        sso: new SsoRouter(transport),
        stripe: new StripeRouter(transport),
        swarm: new SwarmRouter(transport),
        tag: new TagRouter(transport),
        user: new UserRouter(transport),
        volumeBackups: new VolumeBackupsRouter(transport),
        whitelabeling: new WhitelabelingRouter(transport),
      };
}

export class DokployClient implements AllRouters {
    public readonly admin!: AdminRouter;
    public readonly ai!: AiRouter;
    public readonly application!: ApplicationRouter;
    public readonly auditLog!: AuditLogRouter;
    public readonly backup!: BackupRouter;
    public readonly bitbucket!: BitbucketRouter;
    public readonly certificates!: CertificatesRouter;
    public readonly cluster!: ClusterRouter;
    public readonly compose!: ComposeRouter;
    public readonly customRole!: CustomRoleRouter;
    public readonly deployment!: DeploymentRouter;
    public readonly destination!: DestinationRouter;
    public readonly docker!: DockerRouter;
    public readonly domain!: DomainRouter;
    public readonly environment!: EnvironmentRouter;
    public readonly forwardAuth!: ForwardAuthRouter;
    public readonly gitea!: GiteaRouter;
    public readonly github!: GithubRouter;
    public readonly gitlab!: GitlabRouter;
    public readonly gitProvider!: GitProviderRouter;
    public readonly libsql!: LibsqlRouter;
    public readonly licenseKey!: LicenseKeyRouter;
    public readonly mariadb!: MariadbRouter;
    public readonly mongo!: MongoRouter;
    public readonly mounts!: MountsRouter;
    public readonly mysql!: MysqlRouter;
    public readonly notification!: NotificationRouter;
    public readonly organization!: OrganizationRouter;
    public readonly patch!: PatchRouter;
    public readonly port!: PortRouter;
    public readonly postgres!: PostgresRouter;
    public readonly previewDeployment!: PreviewDeploymentRouter;
    public readonly project!: ProjectRouter;
    public readonly redirects!: RedirectsRouter;
    public readonly redis!: RedisRouter;
    public readonly registry!: RegistryRouter;
    public readonly rollback!: RollbackRouter;
    public readonly schedule!: ScheduleRouter;
    public readonly security!: SecurityRouter;
    public readonly server!: ServerRouter;
    public readonly settings!: SettingsRouter;
    public readonly sshKey!: SshKeyRouter;
    public readonly sso!: SsoRouter;
    public readonly stripe!: StripeRouter;
    public readonly swarm!: SwarmRouter;
    public readonly tag!: TagRouter;
    public readonly user!: UserRouter;
    public readonly volumeBackups!: VolumeBackupsRouter;
    public readonly whitelabeling!: WhitelabelingRouter;

    constructor(transport: Transport) {
        Object.assign(this, createAllRouters(transport));
    }
}

export type AdminSetupMonitoringInput = BodyOf<operations["admin-setupMonitoring"]>;
export type AiAnalyzeLogsInput = BodyOf<operations["ai-analyzeLogs"]>;
export type AiCreateInput = BodyOf<operations["ai-create"]>;
export type AiDeleteInput = BodyOf<operations["ai-delete"]>;
export type AiDeployInput = BodyOf<operations["ai-deploy"]>;
export type AiSuggestInput = BodyOf<operations["ai-suggest"]>;
export type AiTestConnectionInput = BodyOf<operations["ai-testConnection"]>;
export type AiUpdateInput = BodyOf<operations["ai-update"]>;
export type ApplicationCancelDeploymentInput = BodyOf<operations["application-cancelDeployment"]>;
export type ApplicationCleanQueuesInput = BodyOf<operations["application-cleanQueues"]>;
export type ApplicationClearDeploymentsInput = BodyOf<operations["application-clearDeployments"]>;
export type ApplicationCreateInput = BodyOf<operations["application-create"]>;
export type ApplicationDeleteInput = BodyOf<operations["application-delete"]>;
export type ApplicationDeployInput = BodyOf<operations["application-deploy"]>;
export type ApplicationDisconnectGitProviderInput = BodyOf<operations["application-disconnectGitProvider"]>;
export type ApplicationDropDeploymentInput = BodyOf<operations["application-dropDeployment"]>;
export type ApplicationKillBuildInput = BodyOf<operations["application-killBuild"]>;
export type ApplicationMarkRunningInput = BodyOf<operations["application-markRunning"]>;
export type ApplicationMoveInput = BodyOf<operations["application-move"]>;
export type ApplicationRedeployInput = BodyOf<operations["application-redeploy"]>;
export type ApplicationRefreshTokenInput = BodyOf<operations["application-refreshToken"]>;
export type ApplicationReloadInput = BodyOf<operations["application-reload"]>;
export type ApplicationSaveBitbucketProviderInput = BodyOf<operations["application-saveBitbucketProvider"]>;
export type ApplicationSaveBuildTypeInput = BodyOf<operations["application-saveBuildType"]>;
export type ApplicationSaveDockerProviderInput = BodyOf<operations["application-saveDockerProvider"]>;
export type ApplicationSaveEnvironmentInput = BodyOf<operations["application-saveEnvironment"]>;
export type ApplicationSaveGiteaProviderInput = BodyOf<operations["application-saveGiteaProvider"]>;
export type ApplicationSaveGithubProviderInput = BodyOf<operations["application-saveGithubProvider"]>;
export type ApplicationSaveGitlabProviderInput = BodyOf<operations["application-saveGitlabProvider"]>;
export type ApplicationSaveGitProviderInput = BodyOf<operations["application-saveGitProvider"]>;
export type ApplicationStartInput = BodyOf<operations["application-start"]>;
export type ApplicationStopInput = BodyOf<operations["application-stop"]>;
export type ApplicationUpdateInput = BodyOf<operations["application-update"]>;
export type ApplicationUpdateTraefikConfigInput = BodyOf<operations["application-updateTraefikConfig"]>;
export type BackupCreateInput = BodyOf<operations["backup-create"]>;
export type BackupManualBackupComposeInput = BodyOf<operations["backup-manualBackupCompose"]>;
export type BackupManualBackupLibsqlInput = BodyOf<operations["backup-manualBackupLibsql"]>;
export type BackupManualBackupMariadbInput = BodyOf<operations["backup-manualBackupMariadb"]>;
export type BackupManualBackupMongoInput = BodyOf<operations["backup-manualBackupMongo"]>;
export type BackupManualBackupMySqlInput = BodyOf<operations["backup-manualBackupMySql"]>;
export type BackupManualBackupPostgresInput = BodyOf<operations["backup-manualBackupPostgres"]>;
export type BackupManualBackupWebServerInput = BodyOf<operations["backup-manualBackupWebServer"]>;
export type BackupRemoveInput = BodyOf<operations["backup-remove"]>;
export type BackupUpdateInput = BodyOf<operations["backup-update"]>;
export type BitbucketCreateInput = BodyOf<operations["bitbucket-create"]>;
export type BitbucketTestConnectionInput = BodyOf<operations["bitbucket-testConnection"]>;
export type BitbucketUpdateInput = BodyOf<operations["bitbucket-update"]>;
export type CertificatesCreateInput = BodyOf<operations["certificates-create"]>;
export type CertificatesRemoveInput = BodyOf<operations["certificates-remove"]>;
export type CertificatesUpdateInput = BodyOf<operations["certificates-update"]>;
export type ClusterRemoveWorkerInput = BodyOf<operations["cluster-removeWorker"]>;
export type ComposeCancelDeploymentInput = BodyOf<operations["compose-cancelDeployment"]>;
export type ComposeCleanQueuesInput = BodyOf<operations["compose-cleanQueues"]>;
export type ComposeClearDeploymentsInput = BodyOf<operations["compose-clearDeployments"]>;
export type ComposeCreateInput = BodyOf<operations["compose-create"]>;
export type ComposeDeleteInput = BodyOf<operations["compose-delete"]>;
export type ComposeDeployInput = BodyOf<operations["compose-deploy"]>;
export type ComposeDeployTemplateInput = BodyOf<operations["compose-deployTemplate"]>;
export type ComposeDisconnectGitProviderInput = BodyOf<operations["compose-disconnectGitProvider"]>;
export type ComposeFetchSourceTypeInput = BodyOf<operations["compose-fetchSourceType"]>;
export type ComposeImportInput = BodyOf<operations["compose-import"]>;
export type ComposeIsolatedDeploymentInput = BodyOf<operations["compose-isolatedDeployment"]>;
export type ComposeKillBuildInput = BodyOf<operations["compose-killBuild"]>;
export type ComposeMoveInput = BodyOf<operations["compose-move"]>;
export type ComposePreviewTemplateInput = BodyOf<operations["compose-previewTemplate"]>;
export type ComposeProcessTemplateInput = BodyOf<operations["compose-processTemplate"]>;
export type ComposeRandomizeComposeInput = BodyOf<operations["compose-randomizeCompose"]>;
export type ComposeRedeployInput = BodyOf<operations["compose-redeploy"]>;
export type ComposeRefreshTokenInput = BodyOf<operations["compose-refreshToken"]>;
export type ComposeSaveEnvironmentInput = BodyOf<operations["compose-saveEnvironment"]>;
export type ComposeStartInput = BodyOf<operations["compose-start"]>;
export type ComposeStopInput = BodyOf<operations["compose-stop"]>;
export type ComposeUpdateInput = BodyOf<operations["compose-update"]>;
export type CustomRoleCreateInput = BodyOf<operations["customRole-create"]>;
export type CustomRoleRemoveInput = BodyOf<operations["customRole-remove"]>;
export type CustomRoleUpdateInput = BodyOf<operations["customRole-update"]>;
export type DeploymentKillProcessInput = BodyOf<operations["deployment-killProcess"]>;
export type DeploymentRemoveDeploymentInput = BodyOf<operations["deployment-removeDeployment"]>;
export type DestinationCreateInput = BodyOf<operations["destination-create"]>;
export type DestinationRemoveInput = BodyOf<operations["destination-remove"]>;
export type DestinationTestConnectionInput = BodyOf<operations["destination-testConnection"]>;
export type DestinationUpdateInput = BodyOf<operations["destination-update"]>;
export type DockerKillContainerInput = BodyOf<operations["docker-killContainer"]>;
export type DockerRemoveContainerInput = BodyOf<operations["docker-removeContainer"]>;
export type DockerRestartContainerInput = BodyOf<operations["docker-restartContainer"]>;
export type DockerStartContainerInput = BodyOf<operations["docker-startContainer"]>;
export type DockerStopContainerInput = BodyOf<operations["docker-stopContainer"]>;
export type DockerUploadFileToContainerInput = BodyOf<operations["docker-uploadFileToContainer"]>;
export type DomainCreateInput = BodyOf<operations["domain-create"]>;
export type DomainDeleteInput = BodyOf<operations["domain-delete"]>;
export type DomainGenerateDomainInput = BodyOf<operations["domain-generateDomain"]>;
export type DomainUpdateInput = BodyOf<operations["domain-update"]>;
export type DomainValidateDomainInput = BodyOf<operations["domain-validateDomain"]>;
export type EnvironmentCreateInput = BodyOf<operations["environment-create"]>;
export type EnvironmentDuplicateInput = BodyOf<operations["environment-duplicate"]>;
export type EnvironmentRemoveInput = BodyOf<operations["environment-remove"]>;
export type EnvironmentUpdateInput = BodyOf<operations["environment-update"]>;
export type ForwardAuthDeployOnServerInput = BodyOf<operations["forwardAuth-deployOnServer"]>;
export type ForwardAuthDisableInput = BodyOf<operations["forwardAuth-disable"]>;
export type ForwardAuthEnableInput = BodyOf<operations["forwardAuth-enable"]>;
export type ForwardAuthRemoveAuthDomainInput = BodyOf<operations["forwardAuth-removeAuthDomain"]>;
export type ForwardAuthRemoveOnServerInput = BodyOf<operations["forwardAuth-removeOnServer"]>;
export type ForwardAuthSetAuthDomainInput = BodyOf<operations["forwardAuth-setAuthDomain"]>;
export type GiteaCreateInput = BodyOf<operations["gitea-create"]>;
export type GiteaTestConnectionInput = BodyOf<operations["gitea-testConnection"]>;
export type GiteaUpdateInput = BodyOf<operations["gitea-update"]>;
export type GithubTestConnectionInput = BodyOf<operations["github-testConnection"]>;
export type GithubUpdateInput = BodyOf<operations["github-update"]>;
export type GitlabCreateInput = BodyOf<operations["gitlab-create"]>;
export type GitlabTestConnectionInput = BodyOf<operations["gitlab-testConnection"]>;
export type GitlabUpdateInput = BodyOf<operations["gitlab-update"]>;
export type GitProviderRemoveInput = BodyOf<operations["gitProvider-remove"]>;
export type GitProviderToggleShareInput = BodyOf<operations["gitProvider-toggleShare"]>;
export type LibsqlChangeStatusInput = BodyOf<operations["libsql-changeStatus"]>;
export type LibsqlCreateInput = BodyOf<operations["libsql-create"]>;
export type LibsqlDeployInput = BodyOf<operations["libsql-deploy"]>;
export type LibsqlMoveInput = BodyOf<operations["libsql-move"]>;
export type LibsqlRebuildInput = BodyOf<operations["libsql-rebuild"]>;
export type LibsqlReloadInput = BodyOf<operations["libsql-reload"]>;
export type LibsqlRemoveInput = BodyOf<operations["libsql-remove"]>;
export type LibsqlSaveEnvironmentInput = BodyOf<operations["libsql-saveEnvironment"]>;
export type LibsqlSaveExternalPortsInput = BodyOf<operations["libsql-saveExternalPorts"]>;
export type LibsqlStartInput = BodyOf<operations["libsql-start"]>;
export type LibsqlStopInput = BodyOf<operations["libsql-stop"]>;
export type LibsqlUpdateInput = BodyOf<operations["libsql-update"]>;
export type LicenseKeyActivateInput = BodyOf<operations["licenseKey-activate"]>;
export type LicenseKeyUpdateEnterpriseSettingsInput = BodyOf<operations["licenseKey-updateEnterpriseSettings"]>;
export type MariadbChangePasswordInput = BodyOf<operations["mariadb-changePassword"]>;
export type MariadbChangeStatusInput = BodyOf<operations["mariadb-changeStatus"]>;
export type MariadbCreateInput = BodyOf<operations["mariadb-create"]>;
export type MariadbDeployInput = BodyOf<operations["mariadb-deploy"]>;
export type MariadbMoveInput = BodyOf<operations["mariadb-move"]>;
export type MariadbRebuildInput = BodyOf<operations["mariadb-rebuild"]>;
export type MariadbReloadInput = BodyOf<operations["mariadb-reload"]>;
export type MariadbRemoveInput = BodyOf<operations["mariadb-remove"]>;
export type MariadbSaveEnvironmentInput = BodyOf<operations["mariadb-saveEnvironment"]>;
export type MariadbSaveExternalPortInput = BodyOf<operations["mariadb-saveExternalPort"]>;
export type MariadbStartInput = BodyOf<operations["mariadb-start"]>;
export type MariadbStopInput = BodyOf<operations["mariadb-stop"]>;
export type MariadbUpdateInput = BodyOf<operations["mariadb-update"]>;
export type MongoChangePasswordInput = BodyOf<operations["mongo-changePassword"]>;
export type MongoChangeStatusInput = BodyOf<operations["mongo-changeStatus"]>;
export type MongoCreateInput = BodyOf<operations["mongo-create"]>;
export type MongoDeployInput = BodyOf<operations["mongo-deploy"]>;
export type MongoMoveInput = BodyOf<operations["mongo-move"]>;
export type MongoRebuildInput = BodyOf<operations["mongo-rebuild"]>;
export type MongoReloadInput = BodyOf<operations["mongo-reload"]>;
export type MongoRemoveInput = BodyOf<operations["mongo-remove"]>;
export type MongoSaveEnvironmentInput = BodyOf<operations["mongo-saveEnvironment"]>;
export type MongoSaveExternalPortInput = BodyOf<operations["mongo-saveExternalPort"]>;
export type MongoStartInput = BodyOf<operations["mongo-start"]>;
export type MongoStopInput = BodyOf<operations["mongo-stop"]>;
export type MongoUpdateInput = BodyOf<operations["mongo-update"]>;
export type MountsCreateInput = BodyOf<operations["mounts-create"]>;
export type MountsRemoveInput = BodyOf<operations["mounts-remove"]>;
export type MountsUpdateInput = BodyOf<operations["mounts-update"]>;
export type MysqlChangePasswordInput = BodyOf<operations["mysql-changePassword"]>;
export type MysqlChangeStatusInput = BodyOf<operations["mysql-changeStatus"]>;
export type MysqlCreateInput = BodyOf<operations["mysql-create"]>;
export type MysqlDeployInput = BodyOf<operations["mysql-deploy"]>;
export type MysqlMoveInput = BodyOf<operations["mysql-move"]>;
export type MysqlRebuildInput = BodyOf<operations["mysql-rebuild"]>;
export type MysqlReloadInput = BodyOf<operations["mysql-reload"]>;
export type MysqlRemoveInput = BodyOf<operations["mysql-remove"]>;
export type MysqlSaveEnvironmentInput = BodyOf<operations["mysql-saveEnvironment"]>;
export type MysqlSaveExternalPortInput = BodyOf<operations["mysql-saveExternalPort"]>;
export type MysqlStartInput = BodyOf<operations["mysql-start"]>;
export type MysqlStopInput = BodyOf<operations["mysql-stop"]>;
export type MysqlUpdateInput = BodyOf<operations["mysql-update"]>;
export type NotificationCreateCustomInput = BodyOf<operations["notification-createCustom"]>;
export type NotificationCreateDiscordInput = BodyOf<operations["notification-createDiscord"]>;
export type NotificationCreateEmailInput = BodyOf<operations["notification-createEmail"]>;
export type NotificationCreateGotifyInput = BodyOf<operations["notification-createGotify"]>;
export type NotificationCreateLarkInput = BodyOf<operations["notification-createLark"]>;
export type NotificationCreateMattermostInput = BodyOf<operations["notification-createMattermost"]>;
export type NotificationCreateNtfyInput = BodyOf<operations["notification-createNtfy"]>;
export type NotificationCreatePushoverInput = BodyOf<operations["notification-createPushover"]>;
export type NotificationCreateResendInput = BodyOf<operations["notification-createResend"]>;
export type NotificationCreateSlackInput = BodyOf<operations["notification-createSlack"]>;
export type NotificationCreateTeamsInput = BodyOf<operations["notification-createTeams"]>;
export type NotificationCreateTelegramInput = BodyOf<operations["notification-createTelegram"]>;
export type NotificationReceiveNotificationInput = BodyOf<operations["notification-receiveNotification"]>;
export type NotificationRemoveInput = BodyOf<operations["notification-remove"]>;
export type NotificationTestCustomConnectionInput = BodyOf<operations["notification-testCustomConnection"]>;
export type NotificationTestDiscordConnectionInput = BodyOf<operations["notification-testDiscordConnection"]>;
export type NotificationTestEmailConnectionInput = BodyOf<operations["notification-testEmailConnection"]>;
export type NotificationTestGotifyConnectionInput = BodyOf<operations["notification-testGotifyConnection"]>;
export type NotificationTestLarkConnectionInput = BodyOf<operations["notification-testLarkConnection"]>;
export type NotificationTestMattermostConnectionInput = BodyOf<operations["notification-testMattermostConnection"]>;
export type NotificationTestNtfyConnectionInput = BodyOf<operations["notification-testNtfyConnection"]>;
export type NotificationTestPushoverConnectionInput = BodyOf<operations["notification-testPushoverConnection"]>;
export type NotificationTestResendConnectionInput = BodyOf<operations["notification-testResendConnection"]>;
export type NotificationTestSlackConnectionInput = BodyOf<operations["notification-testSlackConnection"]>;
export type NotificationTestTeamsConnectionInput = BodyOf<operations["notification-testTeamsConnection"]>;
export type NotificationTestTelegramConnectionInput = BodyOf<operations["notification-testTelegramConnection"]>;
export type NotificationUpdateCustomInput = BodyOf<operations["notification-updateCustom"]>;
export type NotificationUpdateDiscordInput = BodyOf<operations["notification-updateDiscord"]>;
export type NotificationUpdateEmailInput = BodyOf<operations["notification-updateEmail"]>;
export type NotificationUpdateGotifyInput = BodyOf<operations["notification-updateGotify"]>;
export type NotificationUpdateLarkInput = BodyOf<operations["notification-updateLark"]>;
export type NotificationUpdateMattermostInput = BodyOf<operations["notification-updateMattermost"]>;
export type NotificationUpdateNtfyInput = BodyOf<operations["notification-updateNtfy"]>;
export type NotificationUpdatePushoverInput = BodyOf<operations["notification-updatePushover"]>;
export type NotificationUpdateResendInput = BodyOf<operations["notification-updateResend"]>;
export type NotificationUpdateSlackInput = BodyOf<operations["notification-updateSlack"]>;
export type NotificationUpdateTeamsInput = BodyOf<operations["notification-updateTeams"]>;
export type NotificationUpdateTelegramInput = BodyOf<operations["notification-updateTelegram"]>;
export type OrganizationCreateInput = BodyOf<operations["organization-create"]>;
export type OrganizationDeleteInput = BodyOf<operations["organization-delete"]>;
export type OrganizationInviteMemberInput = BodyOf<operations["organization-inviteMember"]>;
export type OrganizationRemoveInvitationInput = BodyOf<operations["organization-removeInvitation"]>;
export type OrganizationSetDefaultInput = BodyOf<operations["organization-setDefault"]>;
export type OrganizationUpdateInput = BodyOf<operations["organization-update"]>;
export type OrganizationUpdateMemberRoleInput = BodyOf<operations["organization-updateMemberRole"]>;
export type PatchCleanPatchReposInput = BodyOf<operations["patch-cleanPatchRepos"]>;
export type PatchCreateInput = BodyOf<operations["patch-create"]>;
export type PatchDeleteInput = BodyOf<operations["patch-delete"]>;
export type PatchEnsureRepoInput = BodyOf<operations["patch-ensureRepo"]>;
export type PatchMarkFileForDeletionInput = BodyOf<operations["patch-markFileForDeletion"]>;
export type PatchSaveFileAsPatchInput = BodyOf<operations["patch-saveFileAsPatch"]>;
export type PatchToggleEnabledInput = BodyOf<operations["patch-toggleEnabled"]>;
export type PatchUpdateInput = BodyOf<operations["patch-update"]>;
export type PortCreateInput = BodyOf<operations["port-create"]>;
export type PortDeleteInput = BodyOf<operations["port-delete"]>;
export type PortUpdateInput = BodyOf<operations["port-update"]>;
export type PostgresChangePasswordInput = BodyOf<operations["postgres-changePassword"]>;
export type PostgresChangeStatusInput = BodyOf<operations["postgres-changeStatus"]>;
export type PostgresCreateInput = BodyOf<operations["postgres-create"]>;
export type PostgresDeployInput = BodyOf<operations["postgres-deploy"]>;
export type PostgresMoveInput = BodyOf<operations["postgres-move"]>;
export type PostgresRebuildInput = BodyOf<operations["postgres-rebuild"]>;
export type PostgresReloadInput = BodyOf<operations["postgres-reload"]>;
export type PostgresRemoveInput = BodyOf<operations["postgres-remove"]>;
export type PostgresSaveEnvironmentInput = BodyOf<operations["postgres-saveEnvironment"]>;
export type PostgresSaveExternalPortInput = BodyOf<operations["postgres-saveExternalPort"]>;
export type PostgresStartInput = BodyOf<operations["postgres-start"]>;
export type PostgresStopInput = BodyOf<operations["postgres-stop"]>;
export type PostgresUpdateInput = BodyOf<operations["postgres-update"]>;
export type PreviewDeploymentDeleteInput = BodyOf<operations["previewDeployment-delete"]>;
export type PreviewDeploymentRedeployInput = BodyOf<operations["previewDeployment-redeploy"]>;
export type ProjectCreateInput = BodyOf<operations["project-create"]>;
export type ProjectDuplicateInput = BodyOf<operations["project-duplicate"]>;
export type ProjectRemoveInput = BodyOf<operations["project-remove"]>;
export type ProjectUpdateInput = BodyOf<operations["project-update"]>;
export type RedirectsCreateInput = BodyOf<operations["redirects-create"]>;
export type RedirectsDeleteInput = BodyOf<operations["redirects-delete"]>;
export type RedirectsUpdateInput = BodyOf<operations["redirects-update"]>;
export type RedisChangePasswordInput = BodyOf<operations["redis-changePassword"]>;
export type RedisChangeStatusInput = BodyOf<operations["redis-changeStatus"]>;
export type RedisCreateInput = BodyOf<operations["redis-create"]>;
export type RedisDeployInput = BodyOf<operations["redis-deploy"]>;
export type RedisMoveInput = BodyOf<operations["redis-move"]>;
export type RedisRebuildInput = BodyOf<operations["redis-rebuild"]>;
export type RedisReloadInput = BodyOf<operations["redis-reload"]>;
export type RedisRemoveInput = BodyOf<operations["redis-remove"]>;
export type RedisSaveEnvironmentInput = BodyOf<operations["redis-saveEnvironment"]>;
export type RedisSaveExternalPortInput = BodyOf<operations["redis-saveExternalPort"]>;
export type RedisStartInput = BodyOf<operations["redis-start"]>;
export type RedisStopInput = BodyOf<operations["redis-stop"]>;
export type RedisUpdateInput = BodyOf<operations["redis-update"]>;
export type RegistryCreateInput = BodyOf<operations["registry-create"]>;
export type RegistryRemoveInput = BodyOf<operations["registry-remove"]>;
export type RegistryTestRegistryInput = BodyOf<operations["registry-testRegistry"]>;
export type RegistryTestRegistryByIdInput = BodyOf<operations["registry-testRegistryById"]>;
export type RegistryUpdateInput = BodyOf<operations["registry-update"]>;
export type RollbackDeleteInput = BodyOf<operations["rollback-delete"]>;
export type RollbackRollbackInput = BodyOf<operations["rollback-rollback"]>;
export type ScheduleCreateInput = BodyOf<operations["schedule-create"]>;
export type ScheduleDeleteInput = BodyOf<operations["schedule-delete"]>;
export type ScheduleRunManuallyInput = BodyOf<operations["schedule-runManually"]>;
export type ScheduleUpdateInput = BodyOf<operations["schedule-update"]>;
export type SecurityCreateInput = BodyOf<operations["security-create"]>;
export type SecurityDeleteInput = BodyOf<operations["security-delete"]>;
export type SecurityUpdateInput = BodyOf<operations["security-update"]>;
export type ServerCreateInput = BodyOf<operations["server-create"]>;
export type ServerRemoveInput = BodyOf<operations["server-remove"]>;
export type ServerSetupInput = BodyOf<operations["server-setup"]>;
export type ServerSetupMonitoringInput = BodyOf<operations["server-setupMonitoring"]>;
export type ServerUpdateInput = BodyOf<operations["server-update"]>;
export type ServerUpdateBuildsConcurrencyInput = BodyOf<operations["server-updateBuildsConcurrency"]>;
export type SettingsAssignDomainServerInput = BodyOf<operations["settings-assignDomainServer"]>;
export type SettingsCleanAllInput = BodyOf<operations["settings-cleanAll"]>;
export type SettingsCleanDockerBuilderInput = BodyOf<operations["settings-cleanDockerBuilder"]>;
export type SettingsCleanDockerPruneInput = BodyOf<operations["settings-cleanDockerPrune"]>;
export type SettingsCleanStoppedContainersInput = BodyOf<operations["settings-cleanStoppedContainers"]>;
export type SettingsCleanUnusedImagesInput = BodyOf<operations["settings-cleanUnusedImages"]>;
export type SettingsCleanUnusedVolumesInput = BodyOf<operations["settings-cleanUnusedVolumes"]>;
export type SettingsReloadTraefikInput = BodyOf<operations["settings-reloadTraefik"]>;
export type SettingsSaveSSHPrivateKeyInput = BodyOf<operations["settings-saveSSHPrivateKey"]>;
export type SettingsSetupGPUInput = BodyOf<operations["settings-setupGPU"]>;
export type SettingsToggleDashboardInput = BodyOf<operations["settings-toggleDashboard"]>;
export type SettingsToggleRequestsInput = BodyOf<operations["settings-toggleRequests"]>;
export type SettingsUpdateBuildsConcurrencyInput = BodyOf<operations["settings-updateBuildsConcurrency"]>;
export type SettingsUpdateDockerCleanupInput = BodyOf<operations["settings-updateDockerCleanup"]>;
export type SettingsUpdateEnforceSSOInput = BodyOf<operations["settings-updateEnforceSSO"]>;
export type SettingsUpdateLogCleanupInput = BodyOf<operations["settings-updateLogCleanup"]>;
export type SettingsUpdateMiddlewareTraefikConfigInput = BodyOf<operations["settings-updateMiddlewareTraefikConfig"]>;
export type SettingsUpdateRemoteServersOnlyInput = BodyOf<operations["settings-updateRemoteServersOnly"]>;
export type SettingsUpdateServerIpInput = BodyOf<operations["settings-updateServerIp"]>;
export type SettingsUpdateTraefikConfigInput = BodyOf<operations["settings-updateTraefikConfig"]>;
export type SettingsUpdateTraefikFileInput = BodyOf<operations["settings-updateTraefikFile"]>;
export type SettingsUpdateTraefikPortsInput = BodyOf<operations["settings-updateTraefikPorts"]>;
export type SettingsUpdateWebServerTraefikConfigInput = BodyOf<operations["settings-updateWebServerTraefikConfig"]>;
export type SettingsWriteTraefikEnvInput = BodyOf<operations["settings-writeTraefikEnv"]>;
export type SshKeyCreateInput = BodyOf<operations["sshKey-create"]>;
export type SshKeyGenerateInput = BodyOf<operations["sshKey-generate"]>;
export type SshKeyRemoveInput = BodyOf<operations["sshKey-remove"]>;
export type SshKeyUpdateInput = BodyOf<operations["sshKey-update"]>;
export type SsoAddTrustedOriginInput = BodyOf<operations["sso-addTrustedOrigin"]>;
export type SsoDeleteProviderInput = BodyOf<operations["sso-deleteProvider"]>;
export type SsoRegisterInput = BodyOf<operations["sso-register"]>;
export type SsoRemoveTrustedOriginInput = BodyOf<operations["sso-removeTrustedOrigin"]>;
export type SsoUpdateInput = BodyOf<operations["sso-update"]>;
export type SsoUpdateTrustedOriginInput = BodyOf<operations["sso-updateTrustedOrigin"]>;
export type StripeCreateCheckoutSessionInput = BodyOf<operations["stripe-createCheckoutSession"]>;
export type StripeUpdateInvoiceNotificationsInput = BodyOf<operations["stripe-updateInvoiceNotifications"]>;
export type StripeUpgradeSubscriptionInput = BodyOf<operations["stripe-upgradeSubscription"]>;
export type TagAssignToProjectInput = BodyOf<operations["tag-assignToProject"]>;
export type TagBulkAssignInput = BodyOf<operations["tag-bulkAssign"]>;
export type TagCreateInput = BodyOf<operations["tag-create"]>;
export type TagRemoveInput = BodyOf<operations["tag-remove"]>;
export type TagRemoveFromProjectInput = BodyOf<operations["tag-removeFromProject"]>;
export type TagUpdateInput = BodyOf<operations["tag-update"]>;
export type UserAssignPermissionsInput = BodyOf<operations["user-assignPermissions"]>;
export type UserCreateApiKeyInput = BodyOf<operations["user-createApiKey"]>;
export type UserCreateUserWithCredentialsInput = BodyOf<operations["user-createUserWithCredentials"]>;
export type UserDeleteApiKeyInput = BodyOf<operations["user-deleteApiKey"]>;
export type UserRemoveInput = BodyOf<operations["user-remove"]>;
export type UserSendInvitationInput = BodyOf<operations["user-sendInvitation"]>;
export type UserToggleTemplateBookmarkInput = BodyOf<operations["user-toggleTemplateBookmark"]>;
export type UserUpdateInput = BodyOf<operations["user-update"]>;
export type VolumeBackupsCreateInput = BodyOf<operations["volumeBackups-create"]>;
export type VolumeBackupsDeleteInput = BodyOf<operations["volumeBackups-delete"]>;
export type VolumeBackupsRunManuallyInput = BodyOf<operations["volumeBackups-runManually"]>;
export type VolumeBackupsUpdateInput = BodyOf<operations["volumeBackups-update"]>;
export type WhitelabelingUpdateInput = BodyOf<operations["whitelabeling-update"]>;
export type ComposeSourceType = NonNullable<ComposeUpdateInput["sourceType"]>;
export type CertificateType = NonNullable<DomainCreateInput["certificateType"]>;
export type DomainType = NonNullable<DomainCreateInput["domainType"]>;
export type ComposeStatus = NonNullable<ComposeUpdateInput["composeStatus"]>;
export type ComposeType = NonNullable<ComposeCreateInput["composeType"]>;
export type TriggerType = NonNullable<ComposeUpdateInput["triggerType"]>;
