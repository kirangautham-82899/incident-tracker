export const INCIDENT_TYPES = {
    ACCIDENT: 'accident',
    FIRE: 'fire',
    MEDICAL: 'medical',
    INFRASTRUCTURE: 'infrastructure',
    SAFETY: 'safety',
    OTHER: 'other'
};

export const INCIDENT_STATUS = {
    REPORTED: 'reported',
    VERIFIED: 'verified',
    IN_PROGRESS: 'in-progress',
    RESOLVED: 'resolved',
    FALSE: 'false'
};

export const SEVERITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

export const INCIDENT_TYPE_OPTIONS = [
    { value: INCIDENT_TYPES.ACCIDENT, label: '🚗 Accident', color: 'orange' },
    { value: INCIDENT_TYPES.FIRE, label: '🔥 Fire', color: 'red' },
    { value: INCIDENT_TYPES.MEDICAL, label: '🚑 Medical Emergency', color: 'pink' },
    { value: INCIDENT_TYPES.INFRASTRUCTURE, label: '🏗️ Infrastructure', color: 'gray' },
    { value: INCIDENT_TYPES.SAFETY, label: '⚠️ Safety Issue', color: 'yellow' },
    { value: INCIDENT_TYPES.OTHER, label: '📌 Other', color: 'blue' }
];

export const STATUS_COLORS = {
    [INCIDENT_STATUS.REPORTED]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [INCIDENT_STATUS.VERIFIED]: 'bg-blue-100 text-blue-800 border-blue-300',
    [INCIDENT_STATUS.IN_PROGRESS]: 'bg-purple-100 text-purple-800 border-purple-300',
    [INCIDENT_STATUS.RESOLVED]: 'bg-green-100 text-green-800 border-green-300',
    [INCIDENT_STATUS.FALSE]: 'bg-gray-100 text-gray-800 border-gray-300'
};

export const SEVERITY_COLORS = {
    [SEVERITY_LEVELS.LOW]: 'bg-green-100 text-green-800',
    [SEVERITY_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [SEVERITY_LEVELS.HIGH]: 'bg-orange-100 text-orange-800',
    [SEVERITY_LEVELS.CRITICAL]: 'bg-red-100 text-red-800'
};
