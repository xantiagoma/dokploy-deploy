/**
 * Known response types for Dokploy API endpoints.
 *
 * These types are verified against real API responses from a Dokploy instance.
 * The generated routers use ResponseMap to auto-type known operations.
 *
 * To find the operation ID for an endpoint:
 *   project.one    → "project-one"
 *   compose.deploy → "compose-deploy"
 */

// ---------------------------------------------------------------------------
// Shared base for all database services
// ---------------------------------------------------------------------------

interface DatabaseServiceBase {
  name: string;
  /** Docker internal hostname — use in connection strings */
  appName: string;
  description: string | null;
  dockerImage: string | null;
  command: string | null;
  args: string[] | null;
  env: string | null;
  memoryReservation: number | null;
  memoryLimit: number | null;
  cpuReservation: number | null;
  cpuLimit: number | null;
  /** External port exposed to the internet (null if not configured) */
  externalPort: number | null;
  applicationStatus: string;
  replicas: number;
  environmentId: string;
  serverId: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Response types — verified against real Dokploy API responses
// ---------------------------------------------------------------------------

export interface ProjectResponse {
  projectId: string;
  name: string;
  description: string | null;
  env: string;
  createdAt: string;
  organizationId: string;
  projectTags: unknown[];
}

export interface EnvironmentResponse {
  environmentId: string;
  name: string;
  description: string | null;
  createdAt: string;
  env: string;
  projectId: string;
  isDefault: boolean;
}

/** environment.byProjectId returns environments with nested service arrays */
export interface EnvironmentWithServicesResponse extends EnvironmentResponse {
  project: ProjectResponse;
  applications: ApplicationResponse[];
  compose: ComposeResponse[];
  postgres: PostgresResponse[];
  mysql: MysqlResponse[];
  mariadb: MariadbResponse[];
  mongo: MongoResponse[];
  redis: RedisResponse[];
  libsql: unknown[];
}

export interface ComposeResponse {
  composeId: string;
  name: string;
  appName: string;
  description: string | null;
  env: string | null;
  composeFile: string;
  refreshToken: string | null;
  sourceType: string;
  composeType: string;
  composePath: string;
  composeStatus: string;
  // GitHub
  repository: string | null;
  owner: string | null;
  branch: string | null;
  autoDeploy: boolean;
  githubId: string | null;
  // GitLab
  gitlabProjectId: number | null;
  gitlabRepository: string | null;
  gitlabOwner: string | null;
  gitlabBranch: string | null;
  gitlabPathNamespace: string | null;
  gitlabId: string | null;
  // Bitbucket
  bitbucketRepository: string | null;
  bitbucketRepositorySlug: string | null;
  bitbucketOwner: string | null;
  bitbucketBranch: string | null;
  bitbucketId: string | null;
  // Gitea
  giteaRepository: string | null;
  giteaOwner: string | null;
  giteaBranch: string | null;
  giteaId: string | null;
  // Custom git
  customGitUrl: string | null;
  customGitBranch: string | null;
  customGitSSHKeyId: string | null;
  // Config
  command: string;
  enableSubmodules: boolean;
  suffix: string;
  randomize: boolean;
  isolatedDeployment: boolean;
  isolatedDeploymentsVolume: boolean;
  triggerType: string | null;
  watchPaths: string[] | null;
  // Relations
  environmentId: string;
  serverId: string | null;
  createdAt: string;
}

export interface ApplicationResponse {
  applicationId: string;
  name: string;
  appName: string;
  description: string | null;
  createdAt: string;
  // Source
  sourceType: string;
  triggerType: string;
  autoDeploy: boolean;
  cleanCache: boolean;
  // GitHub
  githubId: string | null;
  repository: string | null;
  owner: string | null;
  branch: string | null;
  buildPath: string;
  // GitLab
  gitlabId: string | null;
  gitlabProjectId: number | null;
  gitlabRepository: string | null;
  gitlabOwner: string | null;
  gitlabBranch: string | null;
  gitlabBuildPath: string;
  gitlabPathNamespace: string | null;
  // Bitbucket
  bitbucketId: string | null;
  bitbucketRepository: string | null;
  bitbucketRepositorySlug: string | null;
  bitbucketOwner: string | null;
  bitbucketBranch: string | null;
  bitbucketBuildPath: string;
  // Gitea
  giteaId: string | null;
  giteaRepository: string | null;
  giteaOwner: string | null;
  giteaBranch: string | null;
  giteaBuildPath: string;
  // Custom Git
  customGitUrl: string | null;
  customGitBranch: string | null;
  customGitBuildPath: string | null;
  customGitSSHKeyId: string | null;
  enableSubmodules: boolean;
  // Docker
  dockerImage: string | null;
  registryUrl: string | null;
  username: string | null;
  password: string | null;
  registryId: string | null;
  buildRegistryId: string | null;
  rollbackRegistryId: string | null;
  // Build
  buildType: string;
  dockerfile: string;
  dockerContextPath: string | null;
  dockerBuildStage: string | null;
  buildArgs: string | null;
  buildSecrets: string | null;
  publishDirectory: string | null;
  createEnvFile: boolean;
  // Runtime
  env: string | null;
  command: string | null;
  args: string | null;
  replicas: number;
  applicationStatus: string;
  refreshToken: string;
  memoryReservation: number | null;
  memoryLimit: number | null;
  cpuReservation: number | null;
  cpuLimit: number | null;
  rollbackActive: boolean;
  // Preview
  previewPort: number;
  previewHttps: boolean;
  previewPath: string;
  previewCertificateType: string;
  previewLimit: number;
  isPreviewDeploymentsActive: boolean;
  previewEnv: string | null;
  previewBuildArgs: string | null;
  previewWildcard: string | null;
  // Display
  title: string | null;
  subtitle: string | null;
  icon: string | null;
  enabled: boolean | null;
  watchPaths: string[] | null;
  // Relations
  environmentId: string;
  serverId: string | null;
  buildServerId: string | null;
  // Nested relations (included in application.one)
  domains: DomainResponse[];
  redirects: RedirectResponse[];
  security: SecurityResponse[];
  ports: PortResponse[];
  mounts: MountResponse[];
}

export interface NotificationResponse {
  notificationId: string;
  name: string;
  notificationType: string;
  appDeploy: boolean;
  appBuildError: boolean;
  databaseBackup: boolean;
  volumeBackup: boolean;
  dokployRestart: boolean;
  dokployBackup: boolean;
  dockerCleanup: boolean;
  serverThreshold: boolean;
  createdAt: string;
  organizationId: string;
  slackId: string | null;
  telegramId: string | null;
  discordId: string | null;
  emailId: string | null;
  resendId: string | null;
  gotifyId: string | null;
  ntfyId: string | null;
  mattermostId: string | null;
  customId: string | null;
  larkId: string | null;
  pushoverId: string | null;
  teamsId: string | null;
}

/** notification.one returns the base + nested provider relation objects */
export interface NotificationDetailResponse extends NotificationResponse {
  slack: { slackId: string; webhookUrl: string; channel: string } | null;
  telegram: { telegramId: string; botToken: string; chatId: string; messageThreadId: string } | null;
  discord: { discordId: string; webhookUrl: string; decoration: boolean } | null;
  email: { emailId: string; smtpServer: string; smtpPort: number; username: string; password: string; fromAddress: string; toAddresses: string[] } | null;
  gotify: { gotifyId: string; serverUrl: string; appToken: string; priority: number; decoration: boolean } | null;
  ntfy: { ntfyId: string; serverUrl: string; topic: string; accessToken: string; priority: number } | null;
  mattermost: { mattermostId: string; webhookUrl: string; channel: string; username: string } | null;
  custom: { customId: string; endpoint: string; headers: Record<string, string> } | null;
  lark: { larkId: string; webhookUrl: string } | null;
  teams: { teamsId: string; webhookUrl: string } | null;
  pushover: { pushoverId: string; userKey: string; apiToken: string; priority: number; retry: number | null; expire: number | null } | null;
  resend: { resendId: string; apiKey: string; fromAddress: string; toAddresses: string[] } | null;
}

export interface DomainResponse {
  domainId: string;
  host: string;
  https: boolean;
  port: number | null;
  customEntrypoint: string | null;
  path: string | null;
  serviceName: string | null;
  domainType: string | null;
  uniqueConfigKey: number;
  createdAt: string;
  composeId: string | null;
  customCertResolver: string | null;
  applicationId: string | null;
  previewDeploymentId: string | null;
  certificateType: string;
  internalPath: string | null;
  stripPath: boolean;
  middlewares: string[];
}

// ---------------------------------------------------------------------------
// Swarm config shapes (used by database service responses)
// ---------------------------------------------------------------------------

interface SwarmHealthCheck {
  test: string[];
  interval: number;
  timeout: number;
  retries: number;
  startPeriod: number;
}

interface SwarmRestartPolicy {
  condition: string;
  delay: number;
  maxAttempts: number;
  window: number;
}

interface SwarmPlacement {
  constraints: string[];
  preferences: Array<{ spread: string }>;
}

interface SwarmUpdateConfig {
  parallelism: number;
  delay: number;
  failureAction: string;
  monitor: number;
  maxFailureRatio: number;
  order: string;
}

interface SwarmMode {
  replicated?: { replicas: number };
  global?: Record<string, never>;
}

interface SwarmNetwork {
  target: string;
  aliases: string[];
}

interface SwarmEndpointSpec {
  mode: string;
  ports: Array<{ targetPort: number; publishedPort: number; protocol: string }>;
}

interface SwarmUlimits {
  name: string;
  soft: number;
  hard: number;
}

// ---------------------------------------------------------------------------
// Mount shape (used by postgres.one and other DB service responses)
// ---------------------------------------------------------------------------

export interface MountResponse {
  mountId: string;
  type: "volume" | "bind" | "tmpfs" | "file";
  hostPath: string | null;
  volumeName: string | null;
  filePath: string | null;
  content: string | null;
  serviceType: string | null;
  serviceId: string;
  mountPath: string;
  applicationId: string | null;
  composeId: string | null;
  libsqlId: string | null;
  mariadbId: string | null;
  mongoId: string | null;
  mysqlId: string | null;
  postgresId: string | null;
  redisId: string | null;
}

// ---------------------------------------------------------------------------
// Backup shape (used by postgres.one and other DB service responses)
// ---------------------------------------------------------------------------

export interface BackupResponse {
  backupId: string;
  schedule: string;
  enabled: boolean;
  database: string;
  prefix: string;
  destinationType: string;
  databaseType: string;
  destinationId: string;
  keepLatestCount: number | null;
  serviceName: string | null;
  metadata: unknown;
  postgresId: string | null;
  mysqlId: string | null;
  mariadbId: string | null;
  mongoId: string | null;
  s3BucketId: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// DatabaseServiceBase extended with swarm + relations fields
// ---------------------------------------------------------------------------

interface DatabaseServiceBaseExtended extends DatabaseServiceBase {
  healthCheckSwarm: SwarmHealthCheck | null;
  restartPolicySwarm: SwarmRestartPolicy | null;
  placementSwarm: SwarmPlacement | null;
  updateConfigSwarm: SwarmUpdateConfig | null;
  rollbackConfigSwarm: SwarmUpdateConfig | null;
  modeSwarm: SwarmMode | null;
  labelsSwarm: Record<string, string> | null;
  networkSwarm: SwarmNetwork[] | null;
  stopGracePeriodSwarm: number | null;
  endpointSpecSwarm: SwarmEndpointSpec | null;
  ulimitsSwarm: SwarmUlimits[] | null;
  /** Nested environment relation */
  environment: EnvironmentResponse & {
    project: ProjectResponse;
  };
  server: unknown | null;
  mounts: MountResponse[];
  backups: BackupResponse[];
}

export interface PostgresResponse extends DatabaseServiceBase {
  postgresId: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
}

export interface PostgresDetailResponse extends DatabaseServiceBaseExtended {
  postgresId: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
}

export interface MysqlResponse extends DatabaseServiceBase {
  mysqlId: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
  databaseRootPassword: string | null;
}

export interface MariadbResponse extends DatabaseServiceBase {
  mariadbId: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
  databaseRootPassword: string | null;
}

export interface MongoResponse extends DatabaseServiceBase {
  mongoId: string;
  databaseUser: string;
  databasePassword: string;
  replicaSets: boolean | null;
}

export interface RedisResponse extends DatabaseServiceBase {
  redisId: string;
  databasePassword: string;
}

// ---------------------------------------------------------------------------
// SSH Key
// ---------------------------------------------------------------------------

export interface SshKeyResponse {
  sshKeyId: string;
  privateKey: string;
  publicKey: string;
  name: string;
  description: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  organizationId: string;
}

// ---------------------------------------------------------------------------
// Registry (inferred from update schema — cannot create without live Docker)
// ---------------------------------------------------------------------------

export interface RegistryResponse {
  registryId: string;
  registryName: string;
  imagePrefix: string | null;
  username: string;
  password: string;
  registryUrl: string;
  createdAt: string;
  /** @enum "cloud" */
  registryType: string;
  organizationId: string;
  serverId: string | null;
}

// ---------------------------------------------------------------------------
// Destination (S3-compatible backup target)
// ---------------------------------------------------------------------------

export interface DestinationResponse {
  destinationId: string;
  name: string;
  provider: string;
  accessKey: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  endpoint: string;
  additionalFlags: string[];
  organizationId: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Port
// ---------------------------------------------------------------------------

export interface PortResponse {
  portId: string;
  publishedPort: number;
  publishMode: string;
  targetPort: number;
  protocol: string;
  applicationId: string;
}

/** port.one includes the full application relation */
export interface PortDetailResponse extends PortResponse {
  application: ApplicationResponse;
}

// ---------------------------------------------------------------------------
// Redirect
// ---------------------------------------------------------------------------

export interface RedirectResponse {
  redirectId: string;
  regex: string;
  replacement: string;
  permanent: boolean;
  uniqueConfigKey: number;
  createdAt: string;
  applicationId: string;
}

// ---------------------------------------------------------------------------
// Security (HTTP basic auth)
// ---------------------------------------------------------------------------

export interface SecurityResponse {
  securityId: string;
  username: string;
  password: string;
  createdAt: string;
  applicationId: string;
}

// ---------------------------------------------------------------------------
// Schedule
// ---------------------------------------------------------------------------

export interface ScheduleResponse {
  scheduleId: string;
  name: string;
  description: string | null;
  cronExpression: string;
  appName: string;
  serviceName: string | null;
  shellType: string;
  scheduleType: string;
  command: string;
  script: string | null;
  applicationId: string | null;
  composeId: string | null;
  serverId: string | null;
  userId: string | null;
  enabled: boolean;
  timezone: string | null;
  createdAt: string;
}

/** schedule.one includes service relations */
export interface ScheduleDetailResponse extends ScheduleResponse {
  application: ApplicationResponse | null;
  compose: ComposeResponse | null;
  server: unknown | null;
}

// ---------------------------------------------------------------------------
// Tag
// ---------------------------------------------------------------------------

export interface TagResponse {
  tagId: string;
  name: string;
  color: string;
  createdAt: string;
  organizationId: string;
}

// ---------------------------------------------------------------------------
// Volume Backup
// ---------------------------------------------------------------------------

export interface VolumeBackupResponse {
  volumeBackupId: string;
  name: string;
  volumeName: string;
  prefix: string;
  serviceType: string;
  appName: string;
  serviceName: string | null;
  turnOff: boolean;
  cronExpression: string;
  keepLatestCount: number | null;
  enabled: boolean | null;
  applicationId: string | null;
  postgresId: string | null;
  mariadbId: string | null;
  mongoId: string | null;
  mysqlId: string | null;
  redisId: string | null;
  libsqlId: string | null;
  composeId: string | null;
  createdAt: string;
  destinationId: string;
}

/** volumeBackups.one includes all service + destination relations */
export interface VolumeBackupDetailResponse extends VolumeBackupResponse {
  application: ApplicationResponse | null;
  postgres: PostgresResponse | null;
  mysql: MysqlResponse | null;
  mariadb: MariadbResponse | null;
  mongo: MongoResponse | null;
  redis: RedisResponse | null;
  compose: ComposeResponse | null;
  libsql: (DatabaseServiceBase & { libsqlId: string; databaseUser: string; databasePassword: string }) | null;
  destination: DestinationResponse;
}

// ---------------------------------------------------------------------------
// Certificate
// ---------------------------------------------------------------------------

export interface CertificateResponse {
  certificateId: string;
  name: string;
  certificateData: string;
  privateKey: string;
  certificatePath: string | null;
  autoRenew: boolean | null;
  serverId: string | null;
  createdAt: string;
  organizationId: string;
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

export interface ServerResponse {
  serverId: string;
  name: string;
  description: string | null;
  ipAddress: string;
  port: number;
  username: string;
  sshKeyId: string | null;
  serverType: string;
}

// ---------------------------------------------------------------------------
// User / org
// ---------------------------------------------------------------------------

export interface ApiKeyResponse {
  id: string;
  name: string;
  start: string;
  prefix: string | null;
  key: string;
  configId: string;
  referenceId: string;
  refillInterval: number | null;
  refillAmount: number | null;
  lastRefillAt: string | null;
  enabled: boolean;
  rateLimitEnabled: boolean;
  rateLimitTimeWindow: number;
  rateLimitMax: number;
  requestCount: number;
  remaining: number | null;
  lastRequest: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: string[] | null;
  metadata: string | null;
}

export interface UserDetailResponse {
  id: string;
  firstName: string;
  lastName: string;
  isRegistered: boolean;
  expirationDate: string | null;
  createdAt2: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  email: string;
  emailVerified: boolean;
  image: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  updatedAt: string;
  role: string;
  enablePaidFeatures: boolean;
  allowImpersonation: boolean;
  enableEnterpriseFeatures: boolean;
  licenseKey: string | null;
  isValidEnterpriseLicense: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  serversQuantity: number;
  sendInvoiceNotifications: boolean;
  isEnterpriseCloud: boolean;
  trustedOrigins: string[] | null;
  bookmarkedTemplates: string[];
  apiKeys: ApiKeyResponse[];
}

export interface UserGetResponse {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  teamId: string | null;
  isDefault: boolean;
  /** Permission flags (always false for owner role — owner has implicit full access) */
  canCreateProjects: boolean;
  canAccessToSSHKeys: boolean;
  canCreateServices: boolean;
  canDeleteProjects: boolean;
  canDeleteServices: boolean;
  canAccessToDocker: boolean;
  canAccessToAPI: boolean;
  canAccessToGitProviders: boolean;
  canAccessToTraefikFiles: boolean;
  canDeleteEnvironments: boolean;
  canCreateEnvironments: boolean;
  accessedProjects: string[];
  accessedEnvironments: string[];
  accessedServices: string[];
  accessedGitProviders: string[];
  accessedServers: string[];
  user: UserDetailResponse;
}

// ---------------------------------------------------------------------------
// Docker containers
// ---------------------------------------------------------------------------

export interface DockerContainerResponse {
  containerId: string;
  name: string;
  state: string;
  status: string;
}

// ---------------------------------------------------------------------------
// GitHub providers
// ---------------------------------------------------------------------------

export interface GitProviderResponse {
  gitProviderId: string;
  name: string;
  providerType: "github" | "gitlab" | "bitbucket" | "gitea";
  createdAt: string;
  organizationId: string;
  userId: string;
  sharedWithOrganization: boolean;
}

export interface GitHubProviderResponse {
  githubId: string;
  gitProvider: GitProviderResponse;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export type SettingsIpResponse = string;

// ---------------------------------------------------------------------------
// Create project
// ---------------------------------------------------------------------------

export interface CreateProjectResponse {
  project: ProjectResponse;
  environment: EnvironmentResponse;
}

// ---------------------------------------------------------------------------
// Response map — operation ID → response type
// ---------------------------------------------------------------------------

export interface ResponseMap {
  // Project
  "project-all": ProjectResponse[];
  "project-one": ProjectResponse;
  "project-create": CreateProjectResponse;
  "project-update": ProjectResponse;
  "project-remove": ProjectResponse;
  "project-search": ProjectResponse[];

  // Environment
  "environment-byProjectId": EnvironmentWithServicesResponse[];
  "environment-one": EnvironmentResponse;
  "environment-create": EnvironmentResponse;
  "environment-update": EnvironmentResponse;
  "environment-remove": EnvironmentResponse;

  // Application
  "application-one": ApplicationResponse;
  "application-create": ApplicationResponse;
  "application-update": ApplicationResponse;
  "application-delete": ApplicationResponse;
  "application-search": ApplicationResponse[];

  // Compose
  "compose-one": ComposeResponse;
  "compose-create": ComposeResponse;
  "compose-update": ComposeResponse;
  "compose-delete": ComposeResponse;
  "compose-search": ComposeResponse[];

  // Domain
  "domain-one": DomainResponse;
  "domain-byComposeId": DomainResponse[];
  "domain-byApplicationId": DomainResponse[];
  "domain-create": DomainResponse;
  "domain-update": DomainResponse;
  "domain-delete": DomainResponse;

  // Postgres
  "postgres-one": PostgresDetailResponse;
  "postgres-create": PostgresResponse;
  "postgres-update": PostgresResponse;
  "postgres-remove": PostgresResponse;
  "postgres-search": PostgresResponse[];

  // MySQL
  "mysql-one": MysqlResponse;
  "mysql-create": MysqlResponse;
  "mysql-update": MysqlResponse;
  "mysql-remove": MysqlResponse;
  "mysql-search": MysqlResponse[];

  // MariaDB
  "mariadb-one": MariadbResponse;
  "mariadb-create": MariadbResponse;
  "mariadb-update": MariadbResponse;
  "mariadb-remove": MariadbResponse;
  "mariadb-search": MariadbResponse[];

  // MongoDB
  "mongo-one": MongoResponse;
  "mongo-create": MongoResponse;
  "mongo-update": MongoResponse;
  "mongo-remove": MongoResponse;
  "mongo-search": MongoResponse[];

  // Redis
  "redis-one": RedisResponse;
  "redis-create": RedisResponse;
  "redis-update": RedisResponse;
  "redis-remove": RedisResponse;
  "redis-search": RedisResponse[];

  // LibSQL
  "libsql-one": DatabaseServiceBase & { libsqlId: string; databaseUser: string; databasePassword: string; sqldNode: string; sqldPrimaryUrl: string; enableNamespaces: boolean };
  "libsql-create": DatabaseServiceBase & { libsqlId: string; databaseUser: string; databasePassword: string; sqldNode: string; sqldPrimaryUrl: string; enableNamespaces: boolean };
  "libsql-update": DatabaseServiceBase & { libsqlId: string; databaseUser: string; databasePassword: string; sqldNode: string; sqldPrimaryUrl: string; enableNamespaces: boolean };
  "libsql-remove": DatabaseServiceBase & { libsqlId: string; databaseUser: string; databasePassword: string; sqldNode: string; sqldPrimaryUrl: string; enableNamespaces: boolean };

  // Server
  "server-one": ServerResponse;
  "server-create": ServerResponse;
  "server-update": ServerResponse;
  "server-remove": ServerResponse;

  // SSH Key
  "sshKey-all": SshKeyResponse[];
  "sshKey-one": SshKeyResponse;
  "sshKey-create": void;
  "sshKey-update": SshKeyResponse;
  "sshKey-remove": SshKeyResponse;

  // Registry
  "registry-one": RegistryResponse;
  "registry-create": RegistryResponse;
  "registry-update": RegistryResponse;
  "registry-remove": RegistryResponse;
  "registry-all": RegistryResponse[];

  // Certificates
  "certificates-all": CertificateResponse[];
  "certificates-one": CertificateResponse;
  "certificates-create": CertificateResponse;
  "certificates-update": CertificateResponse;
  "certificates-remove": CertificateResponse;

  // Mounts
  "mounts-one": MountResponse;
  "mounts-create": MountResponse;
  "mounts-update": MountResponse;
  "mounts-remove": MountResponse;
  "mounts-listByServiceId": MountResponse[];

  // Port
  "port-one": PortDetailResponse;
  "port-create": PortResponse;
  "port-update": PortResponse;
  "port-delete": PortResponse;

  // Redirects
  "redirects-one": RedirectResponse;
  "redirects-create": true;
  "redirects-update": RedirectResponse;
  "redirects-delete": RedirectResponse;

  // Security
  "security-one": SecurityResponse;
  "security-create": true;
  "security-update": SecurityResponse;
  "security-delete": SecurityResponse;

  // Backup
  "backup-one": BackupResponse;
  "backup-create": BackupResponse;
  "backup-update": BackupResponse;
  "backup-remove": BackupResponse;

  // Destination
  "destination-one": DestinationResponse;
  "destination-create": DestinationResponse;
  "destination-update": DestinationResponse;
  "destination-remove": DestinationResponse;
  "destination-all": DestinationResponse[];

  // Schedule
  "schedule-one": ScheduleDetailResponse;
  "schedule-create": ScheduleResponse;
  "schedule-update": ScheduleResponse;
  "schedule-delete": true;

  // Tag
  "tag-one": TagResponse;
  "tag-create": TagResponse;
  "tag-update": TagResponse;
  "tag-remove": { success: true };

  // Volume Backups
  "volumeBackups-one": VolumeBackupDetailResponse;
  "volumeBackups-create": VolumeBackupResponse;
  "volumeBackups-update": VolumeBackupResponse;
  "volumeBackups-delete": void;

  // Notifications (all types share the same response shape)
  "notification-one": NotificationDetailResponse;
  "notification-all": NotificationResponse[];
  "notification-remove": NotificationResponse;
  "notification-createSlack": NotificationResponse;
  "notification-createTelegram": NotificationResponse;
  "notification-createDiscord": NotificationResponse;
  "notification-createEmail": NotificationResponse;
  "notification-createGotify": NotificationResponse;
  "notification-createNtfy": NotificationResponse;
  "notification-createMattermost": NotificationResponse;
  "notification-createCustom": NotificationResponse;
  "notification-createLark": NotificationResponse;
  "notification-createTeams": NotificationResponse;
  "notification-createPushover": NotificationResponse;
  "notification-createResend": NotificationResponse;
  "notification-updateSlack": NotificationResponse;
  "notification-updateTelegram": NotificationResponse;
  "notification-updateDiscord": NotificationResponse;
  "notification-updateEmail": NotificationResponse;
  "notification-updateGotify": NotificationResponse;
  "notification-updateNtfy": NotificationResponse;
  "notification-updateMattermost": NotificationResponse;
  "notification-updateCustom": NotificationResponse;
  "notification-updateLark": NotificationResponse;
  "notification-updateTeams": NotificationResponse;
  "notification-updatePushover": NotificationResponse;
  "notification-updateResend": NotificationResponse;

  // User
  "user-get": UserGetResponse;

  // Docker
  "docker-getContainersByAppNameMatch": DockerContainerResponse[];

  // Settings
  "settings-getIp": SettingsIpResponse;

  // GitHub
  "github-githubProviders": GitHubProviderResponse[];
}
