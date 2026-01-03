var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.PointOfSale_Api>("api")
  .WithHttpHealthCheck("/health");

var web = builder.AddProject<Projects.PointOfSale_Web>("web")
  .WithHttpHealthCheck("/health");


builder.Build().Run();
