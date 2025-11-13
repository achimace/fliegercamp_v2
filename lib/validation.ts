import { z } from 'zod';

// ============================================
// User Schemas
// ============================================

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Ungültige E-Mail-Adresse')
    .toLowerCase(),
  firstName: z
    .string()
    .min(2, 'Vorname muss mindestens 2 Zeichen lang sein')
    .max(50, 'Vorname darf maximal 50 Zeichen lang sein'),
  lastName: z
    .string()
    .min(2, 'Nachname muss mindestens 2 Zeichen lang sein')
    .max(50, 'Nachname darf maximal 50 Zeichen lang sein'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Passwort muss Groß- und Kleinbuchstaben sowie Zahlen enthalten'
    ),
});

export const LoginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse').toLowerCase(),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

// ============================================
// Organization Schemas
// ============================================

export const CreateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .max(1000, 'Beschreibung darf maximal 1000 Zeichen lang sein')
    .optional(),
  email: z
    .string()
    .email('Ungültige E-Mail-Adresse')
    .toLowerCase()
    .optional(),
  phone: z.string().optional(),
  website: z.string().url('Ungültige URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

// ============================================
// Airfield Schemas
// ============================================

export const CreateAirfieldSchema = z.object({
  name: z
    .string()
    .min(2, 'Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Name darf maximal 100 Zeichen lang sein'),
  icaoCode: z
    .string()
    .length(4, 'ICAO-Code muss 4 Zeichen lang sein')
    .toUpperCase()
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(2000, 'Beschreibung darf maximal 2000 Zeichen lang sein')
    .optional(),
  address: z.string().min(1, 'Adresse ist erforderlich'),
  city: z.string().min(1, 'Stadt ist erforderlich'),
  postalCode: z.string().min(1, 'Postleitzahl ist erforderlich'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// ============================================
// Request Schemas
// ============================================

export const CreateRequestSchema = z.object({
  airfieldId: z.string().cuid('Ungültige Flugplatz-ID'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  numParticipants: z
    .number()
    .int()
    .min(1, 'Mindestens 1 Teilnehmer erforderlich')
    .max(200, 'Maximal 200 Teilnehmer möglich'),
  numAircraft: z
    .number()
    .int()
    .min(1, 'Mindestens 1 Flugzeug erforderlich')
    .max(50, 'Maximal 50 Flugzeuge möglich'),
  message: z
    .string()
    .max(1000, 'Nachricht darf maximal 1000 Zeichen lang sein')
    .optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'Enddatum muss nach Startdatum liegen',
  path: ['endDate'],
});

// ============================================
// Participant Schemas
// ============================================

export const CreateParticipantSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse').toLowerCase(),
  phone: z.string().optional(),
  licenseType: z.string().optional(),
  licenseNumber: z.string().optional(),
});

// ============================================
// Aircraft Schemas
// ============================================

export const CreateAircraftSchema = z.object({
  registration: z
    .string()
    .min(2, 'Kennzeichen muss mindestens 2 Zeichen lang sein')
    .toUpperCase(),
  type: z.string().min(2, 'Typ muss mindestens 2 Zeichen lang sein'),
  manufacturer: z.string().optional(),
});
