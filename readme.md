![README COVER](./img/Cover.jpg)
[![Run Unit Tests](https://github.com/Casmei/gympass-study/actions/workflows/run-unit-tests.yml/badge.svg)](https://github.com/Casmei/gympass-study/actions/workflows/run-unit-tests.yml)
<a href="https://raw.githubusercontent.com/Casmei/gympass-study/refs/heads/main/insomnia.yaml?token=GHSAT0AAAAAADACLJ2E5W6C6QTWTMD5GQQC2D4GADA" download>
  <img src="https://img.shields.io/badge/Insomnia-black?logo=insomnia&logoColor=5849BE" alt="Download Insomnia">
</a>
# Geo Gym
This is a simple API for managing gyms and user check-ins based on geolocation.

## What it does
- Allows users to register and authenticate
- Admin users can create gyms
- Users can search for gyms and find nearby locations using latitude and longitude
- Users can check in at the nearest gym
- Admins can validate user check-ins
- Users can view their check-in history and metrics

## Technical highlights
- Clean architecture with separation of concerns
- Use cases organized with clear business logic boundaries
- Dependency inversion with repository pattern
- In-memory repositories for unit testing
- Factory pattern easy setup in controller
- Unit and end-to-end tests using Vitest
- Fast and isolated test execution
- Built with TypeScript and Fastify

