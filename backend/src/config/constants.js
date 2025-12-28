// Incident Types
export const INCIDENT_TYPES = {
    ACCIDENT: 'accident',
    FIRE: 'fire',
    MEDICAL: 'medical',
    INFRASTRUCTURE: 'infrastructure',
    SAFETY: 'safety',
    OTHER: 'other'
};

// Incident Status
export const INCIDENT_STATUS = {
    REPORTED: 'reported',
    VERIFIED: 'verified',
    IN_PROGRESS: 'in-progress',
    RESOLVED: 'resolved',
    FALSE: 'false'
};

// Severity Levels
export const SEVERITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

// User Roles
export const USER_ROLES = {
    CITIZEN: 'citizen',
    RESPONDER: 'responder',
    ADMIN: 'admin'
};

// Priority Weights for Incident Types
export const TYPE_PRIORITY_WEIGHTS = {
    [INCIDENT_TYPES.FIRE]: 10,
    [INCIDENT_TYPES.MEDICAL]: 9,
    [INCIDENT_TYPES.ACCIDENT]: 7,
    [INCIDENT_TYPES.INFRASTRUCTURE]: 5,
    [INCIDENT_TYPES.SAFETY]: 4,
    [INCIDENT_TYPES.OTHER]: 3
};
