using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.SignalR;

namespace PointOfSale.Model;

public class Order
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string CustomerId { get; set; } = string.Empty;

    [Required]
    public string OrderNumber { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public List<string> Skus {get; set; } = [];
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    public string Status { get; set; } = "Pending";

    public string? VendorInvoice { get; set; }
    public string? OurInvoice { get; set; }

    public bool CustomerInvoiced { get; set; } = false;
    public bool CustomerPaid { get; set; } = false;
    public bool VendorPaid { get; set; } = false;

    [Required]
    public string CreatedBy { get; set; } = string.Empty;

    [ForeignKey("CustomerId")]
    public virtual Customer Customer { get; set; } = null;
}