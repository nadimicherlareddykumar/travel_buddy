const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VALID_STATUSES = ['Wishlist', 'Planned', 'Visited'];

// ─── GET all destinations (with optional ?status & ?country filters) ───────────
const getDestinations = async (req, res) => {
  try {
    const { status, country } = req.query;
    const where = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      where.status = status;
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    const destinations = await prisma.travelDestination.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(destinations);
  } catch (error) {
    console.error('getDestinations error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

// ─── POST create destination ────────────────────────────────────────────────────
const createDestination = async (req, res) => {
  try {
    const { placeName, country, description, status, estimatedBudget, visitedOn, rating } = req.body;

    if (!placeName || !country) {
      return res.status(400).json({ error: 'placeName and country are required' });
    }

    const finalStatus = status || 'Wishlist';
    if (!VALID_STATUSES.includes(finalStatus)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const data = {
      placeName: placeName.trim(),
      country: country.trim(),
      description: description?.trim() || null,
      status: finalStatus,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
      rating: 0,
      visitedOn: null,
    };

    // Rating and visitedOn only make sense for Visited destinations
    if (finalStatus === 'Visited') {
      data.rating = rating ? Math.min(5, Math.max(0, parseInt(rating, 10))) : 0;
      data.visitedOn = visitedOn ? new Date(visitedOn) : null;
    }

    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const destination = await prisma.travelDestination.create({ data });
    res.status(201).json(destination);
  } catch (error) {
    console.error('createDestination error:', error);
    res.status(500).json({ error: 'Failed to create destination' });
  }
};

// ─── PUT update destination ─────────────────────────────────────────────────────
const updateDestination = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const existing = await prisma.travelDestination.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Destination not found' });

    const { placeName, country, description, status, estimatedBudget, visitedOn, rating } = req.body;

    const finalStatus = status || existing.status;
    if (!VALID_STATUSES.includes(finalStatus)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const data = {
      placeName: placeName?.trim() || existing.placeName,
      country: country?.trim() || existing.country,
      description: description !== undefined ? (description?.trim() || null) : existing.description,
      status: finalStatus,
      estimatedBudget:
        estimatedBudget !== undefined && estimatedBudget !== ''
          ? parseFloat(estimatedBudget)
          : existing.estimatedBudget,
      rating: 0,
      visitedOn: null,
    };

    if (finalStatus === 'Visited') {
      data.rating =
        rating !== undefined ? Math.min(5, Math.max(0, parseInt(rating, 10))) : existing.rating;
      data.visitedOn = visitedOn ? new Date(visitedOn) : existing.visitedOn;
    }

    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const destination = await prisma.travelDestination.update({ where: { id }, data });
    res.json(destination);
  } catch (error) {
    console.error('updateDestination error:', error);
    res.status(500).json({ error: 'Failed to update destination' });
  }
};

// ─── DELETE destination ─────────────────────────────────────────────────────────
const deleteDestination = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const existing = await prisma.travelDestination.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Destination not found' });

    await prisma.travelDestination.delete({ where: { id } });
    res.json({ message: 'Destination deleted successfully', id });
  } catch (error) {
    console.error('deleteDestination error:', error);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
};

module.exports = { getDestinations, createDestination, updateDestination, deleteDestination };
