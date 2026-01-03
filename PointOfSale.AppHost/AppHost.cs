var builder = DistributedApplication.CreateBuilder(args);

var web = builder.AddProject<Projects.PointOfSale_Web>("web")
  .WithHttpHealthCheck("/health");

builder.Build().Run();
