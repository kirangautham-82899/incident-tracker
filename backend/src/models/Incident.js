import mongoose from 'mongoose';
import { INCIDENT_TYPES, INCIDENT_STATUS, SEVERITY_LEVELS } from '../config/constants.js';

const incidentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Please specify incident type'],
        enum: Object.values(INCIDENT_TYPES)
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, 'Please provide location coordinates'],
            validate: {
                validator: function (v) {
                    return v.length === 2 &&
                        v[0] >= -180 && v[0] <= 180 && // longitude
                        v[1] >= -90 && v[1] <= 90;     // latitude
                },
                message: 'Invalid coordinates'
            }
        },
        address: {
            type: String,
            trim: true
        }
    },
    severity: {
        type: String,
        enum: Object.values(SEVERITY_LEVELS),
        default: SEVERITY_LEVELS.MEDIUM
    },
    status: {
        type: String,
        enum: Object.values(INCIDENT_STATUS),
        default: INCIDENT_STATUS.REPORTED
    },
    reporter: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        contact: {
            type: String,
            trim: true
        }
    },
    media: [{
        type: {
            type: String,
            enum: ['image', 'video'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    verifications: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    verificationCount: {
        type: Number,
        default: 0
    },
    adminNotes: [{
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        note: {
            type: String,
            required: true,
            maxlength: 500
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    },
    priority: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create geospatial index for location-based queries
incidentSchema.index({ location: '2dsphere' });

// Create indexes for common queries
incidentSchema.index({ type: 1, status: 1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ severity: 1 });

// Update verification count when verifications array changes
incidentSchema.pre('save', function (next) {
    this.verificationCount = this.verifications.length;
    next();
});

// Virtual for age in hours
incidentSchema.virtual('ageInHours').get(function () {
    return (Date.now() - this.createdAt) / (1000 * 60 * 60);
});

// Method to add verification
incidentSchema.methods.addVerification = function (userId) {
    // Check if user already verified
    const alreadyVerified = this.verifications.some(
        v => v.userId.toString() === userId.toString()
    );

    if (!alreadyVerified) {
        this.verifications.push({ userId });
        this.verificationCount = this.verifications.length;
    }

    return this.save();
};

// Method to update status
incidentSchema.methods.updateStatus = function (newStatus, resolvedBy = null) {
    this.status = newStatus;

    if (newStatus === INCIDENT_STATUS.RESOLVED) {
        this.resolvedAt = new Date();
    }

    return this.save();
};

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
